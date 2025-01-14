import { Owner } from "@modules/owner/models/owner.model";
import { cleanupDatabase } from "@/tests/utils/database";
import request from "supertest";
import { app } from "@/server";

let token: string;

beforeAll(async () => {
  // Login as owner
  const response = await request(app).post("/api/v1/restaurant/login").send({
    email: "owner@example.com",
    password: "Password1234!",
    rememberMe: true,
  });

  // Set the token
  token = response.body.accessToken;
});

afterAll(async () => {
  cleanupDatabase([Owner]);
});

describe("Auth Controller", () => {
  it("should login the owner", async () => {
    const response = await request(app).post("/api/v1/restaurant/login").send({
      email: "owner@example.com",
      password: "Password1234!",
      rememberMe: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  it("should logout the owner", async () => {
    const response = await request(app)
      .post("/api/v1/restaurant/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Logged out successfully!");
  });

  it("should create a password for the owner", async () => {
    const owner = await Owner.create({
      firstname: "Test",
      lastname: "Owner",
      email: "newowner@example.com",
      phone: "1234567890",
      password: "password",
      roles: ["owner"],
      permission: ["all"],
    });

    const response = await request(app)
      .put(`/api/v1/restaurant/password/${owner._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "NewPassword123!",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Password created successfully",
    );
  });
});
