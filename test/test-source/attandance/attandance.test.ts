import { app } from "../../config/app";
import request from "supertest";

describe("Attandance Test", () => {
     it("should be success to create a new attandance", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user1", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/attandance")
               .set("Cookie", [`token=${token}`])
               .send({
                    photo: "/attandance2/photo.jpg",
                    location: {
                         latitude: 1321,
                         longitude: 1231,
                    },
                    tagLocation: "Kantor",
               });
          expect(response.status).toBe(200);
     });
     it("should be failed to create a new attandance cause invalid structure", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user1", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/attandance")
               .set("Cookie", [`token=${token}`])
               .send({
                    location: {
                         latitude: 1321,
                         longitude: 1231,
                    },
                    tagLocation: "Kantor",
               });
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(["Ambil foto untuk absensi"]);
          // console.log(response.body)
     });
     it("should be failed to create a new attandance cause not join a group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user2", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/attandance")
               .set("Cookie", [`token=${token}`])
               .send({
                    photo: "/attandance2/photo.jpg",
                    location: {
                         latitude: 1321,
                         longitude: 1231,
                    },
                    tagLocation: "Kantor",
               });
          expect(response.status).toBe(404);
          expect(response.body.message).toStrictEqual("User not found in any group");
     });
     it("should be failed to create a new attandance cause unauthorized", async () => {
          const response = await request(app)
               .post("/attandance")
               .send({
                    photo: "/attandance3/photo.jpg",
                    location: {
                         latitude: 1321,
                         longitude: 1231,
                    },
                    tagLocation: "Kantor",
               });
          expect(response.status).toBe(401);
          expect(response.body.message).toEqual("Anda belum login. Silakan Login terlebih dahulu");
     });
     it("should be success to get all user attandance data's", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user2", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/attandance/getMe")
               .set("Cookie", [`token=${token}`]);
          expect(response.status).toBe(200);
          expect(response.body.message).toBeDefined;
     });
     it("should be success to get all attandance data's", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/attandance")
               .set("Cookie", [`token=${token}`]);
          expect(response.status).toBe(200);
          expect(response.body.message).toBeDefined;
     });
});
