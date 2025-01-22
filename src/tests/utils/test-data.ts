export const userData = {
  id: "00",
  phone: "1234567890",
  email: "user_00@gmail.com",
  password: "admin1234",
  policy: {
    roles: ["admin"],
    permissions: ["CREATE:ALL"],
  },
};

export const branchData = {
  id: "1",
  name: "Branch 1",
  address: "Address 1",
  companyId: "1",
};

export const productData = {
  id: "1",
  name: "Product 1",
  barcode: "1234567890",
  price: 100,
  quantity: 10,
  imgURL: "https://example.com",
  categoryId: "1",
  category: "Category 1",
};

export const categoryData = {
  id: "1",
  name: "Category 1",
};

export const stockData = {
  id: "1",
  productId: "1",
  branchId: "1",
  quantity: 10,
};
