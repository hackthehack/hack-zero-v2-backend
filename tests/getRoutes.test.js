import request from "supertest";
const url = "http://localhost:3001";

test("if /hacklist returns an array of hacks in the databse", async () => {
  const response = await request(url).get("/hacklist");

  expect(response.statusCode).toBe(200);
  expect(response).toBeDefined();
  expect(Array.isArray(response.body)).toBe(true);
}, 30000);
