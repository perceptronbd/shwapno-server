import {
  BasicZodType,
  LocationZodType,
} from "@modules/restaurant/validators/account.validator";
import { Restaurant } from "@modules/restaurant/models/restaurant.model";
import { IRestaurant } from "@modules/restaurant/types/restaurant.type";
import { IOwner } from "@modules/owner/types/owner.type";
import { Owner } from "../../owner/models/owner.model";
import { ClientSession, startSession } from "mongoose";

const basic = async (
  basic: BasicZodType,
): Promise<{
  newRestaurant: Partial<IRestaurant>;
  newOwner: Partial<IOwner>;
}> => {
  const session: ClientSession = await startSession();

  session.startTransaction();

  try {
    const { name, category, email, ownerName, ownerPhone, acronym } = basic;

    const existingRestaurant = await Restaurant.findOne({
      name,
      category,
      acronym,
    }).session(session);

    if (existingRestaurant) {
      const existingOwner = await Owner.findOne({
        restaurantId: existingRestaurant._id,
        email,
        firstname: ownerName,
        phone: ownerPhone,
      }).session(session);

      if (existingOwner) {
        await session.abortTransaction();
        session.endSession();

        return {
          newRestaurant: existingRestaurant,
          newOwner: existingOwner,
        };
      }
    }

    const newRestaurant = await Restaurant.create(
      [
        {
          name,
          category,
          acronym,
        },
      ],
      { session },
    );

    const newOwner = await Owner.create(
      [
        {
          restaurantId: newRestaurant[0]._id,
          firstname: ownerName,
          email: email,
          phone: ownerPhone,
        },
      ],

      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return { newRestaurant: newRestaurant[0], newOwner: newOwner[0] };
  } catch (error: unknown) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

const location = async (
  data: LocationZodType,
): Promise<{ newRestaurant: Partial<IRestaurant> }> => {
  const { country, division, district, exactLocation, restaurantId } = data;

  const existingRestaurant = await Restaurant.findOne({
    _id: restaurantId,
  });

  if (existingRestaurant) {
    return { newRestaurant: existingRestaurant };
  }

  const newRestaurant = await Restaurant.create({
    country,
    division,
    district,
    exactLocation,
  });

  return { newRestaurant };
};

export const accountService = {
  basic,
  location,
};
