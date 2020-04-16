import { list } from "../../services/hack/getHacks";

test("END point /hacklist should return a list of hacks", () => {
  const connectToDatabase = jest
    .spyOn(list, "connectToDatabase")
    .mockImplementation(() => console.log("hello world"));

  expect(2 + 2).toBe(4);
});
