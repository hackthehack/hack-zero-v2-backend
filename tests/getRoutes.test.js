import request from "supertest";
const url = "http://localhost:3001";
jest.setTimeout(30000);
test("if /hacklist returns an array of hacks in the databse", async done => {
  const response = await request(url).get("/hacklist");

  expect(response.statusCode).toBe(200);
  expect(response).toBeDefined();
  expect(Array.isArray(response.body)).toBe(true);
  done();
});
