import { accountService } from "@modules/restaurant/services/account.service";
import { basicRestaurantData, locationData } from "@/tests/utils/test-data";
import { Restaurant } from "@modules/restaurant/models/restaurant.model";
import { Owner } from "@modules/owner/models/owner.model";
import { setupTestSession } from "@/tests/setup/setup";
import { assertions } from "@/tests/utils/assertions";

jest.mock("@modules/restaurant/models/restaurant.model");
jest.mock("@modules/owner/models/owner.model");
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  startSession: jest.fn(),
}));

describe("Restaurant Account Service", () => {
  const getSession = setupTestSession();

  describe("basic", () => {
    it("should create a new restaurant and owner", async () => {
      const session = getSession();

      const { name, category, email, ownerName, ownerPhone, acronym } =
        basicRestaurantData;

      // mocking
      (Restaurant.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue(null),
      }));
      (Restaurant.create as jest.Mock).mockReturnValue([
        { _id: "restaurantId", name, category, acronym },
      ]);

      (Owner.create as jest.Mock).mockReturnValue([
        { _id: "ownerId", firstname: ownerName, email, phone: ownerPhone },
      ]);

      // Run the test
      const result = await accountService.basic(basicRestaurantData);

      // Assertions
      expect(Restaurant.findOne).toHaveBeenCalledWith({
        name,
        category,
        acronym,
      });
      expect(Restaurant.create).toHaveBeenCalledWith(
        [{ name, category, acronym }],
        { session },
      );
      expect(Owner.create).toHaveBeenCalledWith(
        [
          {
            restaurantId: "restaurantId",
            firstname: ownerName,
            email,
            phone: ownerPhone,
          },
        ],
        { session },
      );

      expect(result.newRestaurant).toEqual({
        _id: "restaurantId",
        name,
        category,
        acronym,
      });
      expect(result.newOwner).toEqual({
        _id: "ownerId",
        firstname: ownerName,
        email,
        phone: ownerPhone,
      });

      assertions.expectTransactionStarted(session);
      assertions.expectTransactionCommitted(session);
      assertions.expectSessionEnded(session);
    });

    it("should create an owner if the restaurant exists", async () => {
      const session = getSession();

      const { name, category, email, ownerName, ownerPhone, acronym } =
        basicRestaurantData;

      // mocking
      (Restaurant.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue({ _id: "restaurantId" }),
      }));
      (Owner.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue(null),
      }));
      (Owner.create as jest.Mock).mockReturnValue([
        { _id: "ownerId", firstname: ownerName, email, phone: ownerPhone },
      ]);

      // Run the test
      const result = await accountService.basic(basicRestaurantData);

      // Assertions
      expect(Restaurant.findOne).toHaveBeenCalledWith({
        name,
        category,
        acronym,
      });
      expect(Restaurant.create).not.toHaveBeenCalled();
      expect(Owner.findOne).toHaveBeenCalledWith({
        restaurantId: "restaurantId",
        email,
        firstname: ownerName,
        phone: ownerPhone,
      });
      expect(Owner.create).toHaveBeenCalledWith(
        [
          {
            restaurantId: "restaurantId",
            firstname: ownerName,
            email,
            phone: ownerPhone,
          },
        ],
        { session },
      );

      expect(result.newRestaurant).toEqual({
        _id: "restaurantId",
        name,
        category,
        acronym,
      });
      expect(result.newOwner).toEqual({
        _id: "ownerId",
        firstname: ownerName,
        email,
        phone: ownerPhone,
      });

      assertions.expectTransactionStarted(session);
      assertions.expectTransactionCommitted(session);
      assertions.expectSessionEnded(session);
    });

    it("should not create restuarant if it exists", async () => {
      const session = getSession();

      const { name, category, email, ownerName, ownerPhone, acronym } =
        basicRestaurantData;

      // mocking
      (Restaurant.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue({ _id: "restaurantId" }),
      }));
      (Owner.findOne as jest.Mock).mockImplementation(() => ({
        session: jest.fn().mockResolvedValue({ _id: "ownerId" }),
      }));

      // Run the test
      const result = await accountService.basic(basicRestaurantData);

      // Assertions
      expect(Restaurant.findOne).toHaveBeenCalledWith({
        name,
        category,
        acronym,
      });
      expect(Restaurant.create).not.toHaveBeenCalled();
      expect(Owner.findOne).toHaveBeenCalledWith({
        restaurantId: "restaurantId",
        email,
        firstname: ownerName,
        phone: ownerPhone,
      });
      expect(Owner.create).not.toHaveBeenCalled();

      expect(result.newRestaurant).toEqual({
        _id: "restaurantId",
        name,
        category,
        acronym,
      });
      expect(result.newOwner).toEqual({
        _id: "ownerId",
        firstname: ownerName,
        email,
        phone: ownerPhone,
      });

      assertions.expectTransactionStarted(session);
      assertions.expectTransactionAborted(session);
      assertions.expectSessionEnded(session);
    });
  });

  describe("location", () => {
    it("should update the location information of the restaurant", async () => {
      (Restaurant.findOne as jest.Mock).mockResolvedValue({
        _id: "restaurantId",
        ...locationData,
      });

      const result = await accountService.location(locationData);

      expect(result.newRestaurant).toEqual({
        _id: "restaurantId",
        ...locationData,
      });
    });
  });
});
