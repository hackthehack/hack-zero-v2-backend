import { auth } from "../../services/auth/authUser";

jest.mock("../../services/database/db", () => ({
  __esModule: true,
  connectToDatabase: jest.fn(),
}));

jest.mock("../../services/database/models/UserModel", () => {
  return {
    test: "test",
  };
});

test("END point /auth should return status 200 with correct parameters in req.body", async () => {
  // const event = { body: { email: "test@test.com", password: "test" } };
  // const result = await auth(event, {});
  // console.log(result);
});
