import { app } from "../../config/app";
import request from "supertest";

describe("Register test server", () => {
     it("Should be succes to create new user", async () => {
          const newUser = {
               username: "wahdie",
               email: "wahdie@gmail.com",
               role: "user",
               password: "12345678",
          };
          const response = await request(app).post("/auth/register").send(newUser);
          expect(response.status).toBe(200);
          expect(response.body.message).toBe("Success");
          expect(response.body.newUser.username).toEqual(newUser.username);
          expect(response.body.newUser.email).toEqual(newUser.email);
          expect(response.body.newUser.role).toEqual(newUser.role);
     });

     it("Should be  failed to create a new user due to duplicated email and username", async () => {
          const newUser = {
               username: "user1",
               email: "user1@gmail.com",
               role: "user",
               password: "12345678",
          };
          const response = await request(app).post("/auth/register").send(newUser);
          expect(response.status).toBe(400);
          expect(response.body.errorMessage).toBe("Registration Failed");
          expect(response.body.message).toStrictEqual([
               "Email sudah digunakan!",
               "Username sudah digunakan!",
          ]);
     });
     it("Should be  failed to create a new user due to invalid email", async () => {
          const newUser = {
               username: "ronaldo",
               email: "ronaldogmail.com",
               role: "user",
               password: "12345678",
          };
          const response = await request(app).post("/auth/register").send(newUser);
          expect(response.status).toBe(400);
          expect(response.body.errorMessage).toBe("Registration Failed");
          expect(response.body.message).toStrictEqual(["Email is required"]);
     });
     it("Should be  failed to create a new user due to invalid password", async () => {
          const newUser = {
               username: "ronaldo",
               email: "ronaldo@gmail.com",
               role: "user",
               password: "1234567",
          };
          const response = await request(app).post("/auth/register").send(newUser);
          expect(response.status).toBe(400);
          expect(response.body.errorMessage).toBe("Registration Failed");
          expect(response.body.message).toStrictEqual(["Password minimal mengandung 8 karakter"]);
     });
});
