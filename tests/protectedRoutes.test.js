import request from "supertest";

test("/edithack route should not be accessible without jwt token", async done => {
  const response = await request("http://localhost:3001")
    .post("/edithack")
    .send({ data: "test" });
  expect(response.statusCode).toBe(401);
  done();
});
