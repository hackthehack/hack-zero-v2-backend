import request from "supertest";
const url = "http://localhost:3001";
test("/edithack route should not be accessible without jwt token", async done => {
  const response = await request(url)
    .post("/edithack")
    .send({ data: "test" });
  expect(response.statusCode).toBe(401);
  done();
});

test("/addhack route should not be accessible without jwt token", async done => {
  const response = await request(url)
    .post("/addhack")
    .send({ data: "test" });
  expect(response.statusCode).toBe(401);
  done();
});

test("/joinhack route should not be accessible without jwt token", async done => {
  const response = await request(url)
    .post("/joinhack")
    .send({ data: "test" });
  expect(response.statusCode).toBe(401);
  done();
});
