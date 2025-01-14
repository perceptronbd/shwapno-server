import { adminData } from "@/tests/utils/test-data";
import { AdminValidate } from "./admin.validator";

describe("Create Validator", () => {
  it("should pass with valid data", () => {
    const validData = {
      body: {
        ...adminData,
      },
    };

    expect(() => AdminValidate.create.parse(validData)).not.toThrow();
  });

  it("should fail with invalid data", () => {
    const invalidData = {
      body: {
        username: "u",
        email: "invalid-email",
        phone: "123",
        password: "123",
        roles: ["INVALID_ROLE"],
        permission: ["INVALID_PERMISSION"],
      },
    };

    expect(() => AdminValidate.create.parse(invalidData)).toThrow();
  });

  it("should fail when required fields are missing", () => {
    const missingFieldsData = {
      body: {},
    };

    expect(() => AdminValidate.create.parse(missingFieldsData)).toThrow();
  });
});

describe("Login Validator", () => {
  it("should pass with valid data", () => {
    const { email, password } = adminData;
    const validData = {
      body: {
        email,
        password,
        rememberMe: true,
      },
    };

    expect(() => AdminValidate.login.parse(validData)).not.toThrow();
  });

  it("should fail with invalid email", () => {
    const invalidEmailData = {
      body: {
        email: "invalid-email",
        password: "validPassword",
        rememberMe: true,
      },
    };

    expect(() => AdminValidate.login.parse(invalidEmailData)).toThrow();
  });

  it("should pass with missing rememberMe (default to false)", () => {
    const { email, password } = adminData;
    const missingRememberMeData = {
      body: {
        email,
        password,
      },
    };

    expect(() =>
      AdminValidate.login.parse(missingRememberMeData),
    ).not.toThrow();
  });
});
