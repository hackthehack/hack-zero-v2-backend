import { list } from "../../services/hack/getHacks";

jest.mock("../../services/database/db", () => ({
  __esModule: true,
  connectToDatabase: jest.fn(),
}));
jest.mock("../../services/database/models/HackModel", () => {
  return {
    aggregate: jest.fn().mockReturnValue([
      {
        id: "123",
        title: "I am test",
        description: "description",
        goal: "goal",
        team: [
          {
            name: "Jim",
          },
          { name: "Pete" },
        ],
        status: "looking",
        likes: 0,
      },
    ]),
  };
});
test("END point /hacklist should return a list of hacks", async () => {
  const result = await list({ queryStringParameters: { id: "" } }, {});
  const expectedResponse = JSON.stringify([
    {
      id: "123",
      title: "I am test",
      description: "description",
      goal: "goal",
      team: [
        {
          name: "Jim",
        },
        { name: "Pete" },
      ],
      status: "looking",
      likes: 0,
    },
  ]);
  expect(result.body).toEqual(expectedResponse);
});
