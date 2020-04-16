import { list } from "../../services/hack/getHacks";
import { connectToDatabase } from "../../services/database/db";
import Hack from "../../services/database/models/HackModel";

jest.mock("../../services/database/db", () => ({
  __esModule: true,
  connectToDatabase: jest.fn(),
}));
jest.mock("../../services/database/models/HackModel", () => {
  return {
    aggregate: jest.fn(),
  };
});
test("END point /hacklist should return a list of hacks", async () => {
  //const spyFunc = jest.spy(list)
  connectToDatabase.mockImplementation(() => () =>
    Promise.resolve("mocked value")
  );
  //Hack.mockImplementation(() => () => Promise.resolve("hello"));
  const result = await list({}, {});
  console.log(result);
});
