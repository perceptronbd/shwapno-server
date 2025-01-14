import { Employee } from "@modules/employee/models/employee.model";
import { app } from "@/tests/setup/global-setup";
import request from "supertest";

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

describe("Employee Service", () => {
  it("should create a new employee", async () => {
    const response = await request(app)
      .post("/api/v1/employee")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "0987654321",
        password: "password",
        roles: ["employee"],
        permission: ["view_reports"],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.firstname).toBe("John");
  });

  it("should fetch all employees", async () => {
    const response = await request(app)
      .get("/api/v1/employee")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should update an employee", async () => {
    const employee = await Employee.create({
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      phone: "1234567890",
      password: "password",
      roles: ["employee"],
      permission: ["view_reports"],
    });

    const response = await request(app)
      .put(`/api/v1/employee/${employee._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Jane Updated" });

    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe("Jane Updated");
  });

  it("should delete an employee", async () => {
    const employee = await Employee.create({
      firstname: "Mark",
      lastname: "Smith",
      email: "mark.smith@example.com",
      phone: "0987654321",
      password: "password",
      roles: ["employee"],
      permission: ["view_reports"],
    });

    const response = await request(app)
      .delete(`/api/v1/employee/${employee._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Employee deleted successfully",
    );
  });
});
