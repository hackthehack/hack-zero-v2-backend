import { list } from "../../services/hack/getHacks";
jest.mock("../../services/database/db", () => {
  return Promise.resolve({ test: "test" });
});
test("END point /hacklist should return a list of hacks", async () => {
  //const spyFunc = jest.spy(list)

  const result = await list({}, {});
  console.log(result);
});
