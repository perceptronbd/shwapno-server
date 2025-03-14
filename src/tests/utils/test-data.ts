export const userProfile = {
  id: "88d7cee4-981d-47d3-af70-4e5c9234d6e7",
  email: "shohag@shwapno.com",
  firstName: "MD Shohag",
  lastName: "Miya",
  phone: "01712345678",
  userRoles: [
    {
      role: {
        name: "admin",
      },
    },
  ],
};

export const userData = {
  id: "user-001",
  firstName: "Shohag",
  phone: "1234567890",
  email: "user_00@gmail.com",
  password: "admin1234",
  policy: {
    roles: ["admin"],
    permissions: ["CREATE:ALL"],
  },
  branches: [{ id: "branch-001", name: "Nurer Chala" }],
};

export const customerData = {
  id: "customer-001",
  firstName: "Customer",
  lastName: "One",
  email: "customer@gmail.com",
  mobile: "1234567890",
  address: "Address 1",
};

export const branchData = {
  id: "branch-001",
  name: "Branch 1",
  address: "Address 1",
  companyId: "company-001",
};

export const productData = {
  id: "product-001",
  name: "Product 1",
  barcode: "1234567890",
  description: "Description of the product",
  price: 100,
  quantity: 10,
  categoryId: "category-001",
  category: "Category 1",
  imgURL: "http://existing.com/existing.png",
  imgPublicId: "existingPublicId",
};

export const categoryData = {
  id: "category-001",
  name: "Category 1",
};

export const stockData = {
  id: "stock-001",
  productId: "product-001",
  branchId: "branch-001",
  quantity: 10,
};

export const cartData = {
  id: "cart-001",
  sessionId: "session-001",
  customerId: "customer-001",
  items: [
    {
      id: "cart-item-001",
      cartId: "cart-001",
      productId: productData.id,
      quantity: 2,
      price: productData.price,
      product: {
        ...productData,
      },
    },
  ],
};

export const orderData = {
  id: "order-001",
  customerId: "customer-001",
  branchId: "branch-001",
  customer: {
    ...customerData,
  },
  items: [
    {
      id: "order-item-001",
      orderId: "order-001",
      productId: productData.id,
      quantity: 2,
      price: productData.price,
      product: {
        name: productData.name,
        barcode: productData.barcode,
        category: productData.category,
        imgURL: productData.imgURL,
      },
    },
  ],
  status: "PENDING",
  totalAmount: 250,
  createdAt: new Date(),
  updatedAt: new Date(),
};
