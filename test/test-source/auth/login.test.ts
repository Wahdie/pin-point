import { app } from "../../config/app";
import request from "supertest";

describe("Login test", () => {
     it("should be success to login", async () => {
          const response = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          expect(response.status).toBe(200);
          // console.log(response.body);
          expect(response.body.msg).toBe("Login Successfully");
     });

     it("should be failed to login due to incorrect password", async () => {
          const response = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "1234567" });
          expect(response.status).toBe(400);
          expect(response.body.message).toBe("Invalid password");
     });
     it("should be failed to login due to incorrect username", async () => {
          const response = await request(app)
               .post(`/auth/login`)
               .send({ username: "admi", password: "12345678" });
          expect(response.status).toBe(400);
          expect(response.body.message).toBe("Invalid username");
     });
     it("should be failed to login due to empty username and password", async () => {
          const response = await request(app).post(`/auth/login`).send({});
          expect(response.status).toBe(400);
          expect(response.body.message).toBe("username or email and password are required");
     });
});
