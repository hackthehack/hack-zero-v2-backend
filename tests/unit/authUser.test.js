import * as authHelper from "../../services/auth/authUser";

jest.mock("../../services/database/db", () => ({
  __esModule: true,
  connectToDatabase: jest.fn(),
}));

jest.mock("../../services/database/models/UserModel", () => {
  return {
    findOne: jest.fn().mockReturnValue({
      _id: "randomID",
    }),
  };
});

test("END point /auth should return status 200 with correct parameters in req.body", async () => {
  const body = JSON.stringify({
    email: "test@test.com",
    password: "password",
  });
  const spy = jest.spyOn(authHelper, "utilPromiseInitAuth");
  spy.mockReturnValue({ test: "test" });
  const result = await authHelper.auth({ body }, {});

  expect(result.statusCode).toBe(200);
});
