import { app } from "../../config/app";
import request from "supertest";
import { UserModel } from "../../../src/model/usersModel";

describe("User Test", () => {
     it("should be able to get user information", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;
          const response = await request(app)
               .get("/users")
               .set("Cookie", "token=" + token);
          expect(response.status).toBe(200);
          expect(response.body).not.toBeNull();
          expect(response.body[0].username).toBe("admin");
          expect(response.body[1].username).toBe("user1");
          expect(response.body[2].username).toBe("user2");
     });
     it("should be able to update user password", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          // Mengambil id pengguna dari req.body.user
          const user = await UserModel.findOne({ username: "admin" });
          const idUser = user?.id;
          const response = await request(app)
               .put("/users/update-password/" + idUser)
               .set("Cookie", "token=" + token)
               .send({
                    password: "12345678",
               });
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual("success");
     });
     it("should be failed to update other user password", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          // Mengambil id pengguna dari req.body.user
          const user = await UserModel.findOne({ username: "user1" });
          const idUser = user?.id;
          const response = await request(app)
               .put("/users/update-password/" + idUser)
               .set("Cookie", "token=" + token)
               .send({
                    password: "12345678",
               });
          expect(response.status).toBe(403);
          expect(response.body.message).toEqual("Tidak dapat mengubah password user lain");
          // console.log(response.body.message);
     });
     it("should be failed to update password cause of invalid password", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          // Mengambil id pengguna dari req.body.user
          const user = await UserModel.findOne({ username: "admin" });
          const idUser = user?.id;
          const response = await request(app)
               .put("/users/update-password/" + idUser)
               .set("Cookie", "token=" + token)
               .send({
                    password: "1234567",
               });
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(["Password minimal mengandung 8 karakter"]);
     });
     it("should be able to get user by id", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          const user = await UserModel.findOne({ username: "user1" });
          const idUser = user?.id;
          const response = await request(app)
               .get("/users/" + idUser)
               .set("Cookie", "token=" + token);

          expect(response.status).toBe(200);
          expect(response.body._id).not.toBeNull();
          expect(response.body.username).toEqual("user1");
          expect(response.body.email).toEqual("user1@gmail.com");
     });
     it("should be failed to get user by id cause of invalid id", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          const idUser = "makan";
          const response = await request(app)
               .get("/users/" + idUser)
               .set("Cookie", "token=" + token);

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(["Invalid ID user"]);
     });
     it("should be failed to update password cause of invalid password", async () => {
          const authResponse = await request(app)
               .post("/auth/login")
               .send({ username: "admin", password: "12345678" });

          const { token } = authResponse.body;

          // Mengambil id pengguna dari req.body.user
          const user = await UserModel.findOne({ username: "user2" });
          const idUser = user?.id;
          const response = await request(app)
               .delete("/users/" + idUser)
               .set("Cookie", "token=" + token);
          expect(response.status).toBe(200);
          expect(response.body.message).toEqual(
               "User deleted and removed from all groups successfully"
          );
     });
});
