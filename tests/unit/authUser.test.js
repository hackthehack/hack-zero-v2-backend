import { auth } from "../../services/auth/authUser";

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
  // const mockCognitoCall = jest.mock();
  // mockCognitoCall
  //   .spyOn(authHelper, "utilPromiseInitAuth")
  //   .mockReturnValue({ test: "okay" });
  const result = await auth({ body }, {});

  console.log(result);
});
