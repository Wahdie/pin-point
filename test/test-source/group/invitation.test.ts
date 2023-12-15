import { app } from "../../config/app";
import request from "supertest";

describe("Invite Group Test", () => {
     it("should be success to invite user to group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);

          const idGroup = response.body.groups[0]._id;
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({ receiverEmail: "user2@gmail.com" });
          expect(inviteResponse.status).toBe(201);
          expect(inviteResponse.body).toBeDefined();
     });

     it("should be failed to invite user to group cause reciver not found", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);

          const idGroup = response.body.groups[0]._id;
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({});
          expect(inviteResponse.status).toBe(400);
          expect(inviteResponse.body.message).toEqual([
               "Email tidak valid",
               "Email penerima tidak boleh kosong",
          ]);
     });
     it("should be failed to invite user to group cause email reciver not valid", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);

          const idGroup = response.body.groups[0]._id;
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({ receiverEmail: "user2gmail.com" });
          expect(inviteResponse.status).toBe(400);
          expect(inviteResponse.body.message).toEqual(["Email tidak valid"]);
     });

     it("should be failed to invite user to group cause group not found", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;

          const idGroup = "656fdb24fe72456751b7e3b2";
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({ receiverEmail: "user2@gmail.com" });
          expect(inviteResponse.status).toBe(404);
          expect(inviteResponse.body.message).toEqual("Group not found");
     });

     it("should be failed to invite user to group cause id group not valid", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;

          const idGroup = "makan";
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({ receiverEmail: "user2@gmail.com" });
          expect(inviteResponse.status).toBe(400);
          expect(inviteResponse.body.message).toEqual(["Invalid ID Group"]);
     });
     it("should be failed to invite user to cause not admin", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user1", password: "12345678" });
          const { token } = authResponse.body;

          const idGroup = "656fdb24fe72456751b7e3b2";
          const inviteResponse = await request(app)
               .post("/groups/send-invitation/" + idGroup)
               .set("Cookie", [`token=${token}`])
               .send({ receiverEmail: "user2@gmail.com" });
          expect(inviteResponse.status).toBe(403);
          expect(inviteResponse.body.message).toEqual("Akses  ditolak. Anda bukan admin");
     });

     it("should to be able to get invitation", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user2", password: "12345678" });
          const { token } = authResponse.body;

          const inviteResponse = await request(app)
               .get("/groups/invitation")
               .set("Cookie", [`token=${token}`]);

          expect(inviteResponse.status).toBe(200);
          expect(inviteResponse.body.invite).not.toBeNull();
     });

     it("should to be able to accept invitation", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user2", password: "12345678" });
          const { token } = authResponse.body;

          const inviteResponse = await request(app)
               .get("/groups/invitation")
               .set("Cookie", [`token=${token}`]);

          const idInvitation = inviteResponse.body[0]._id;
          const response = await request(app)
               .post("/groups/accept/" + idInvitation)
               .set("Cookie", [`token=${token}`]);

          expect(response.status).toBe(200);
          expect(response.body.msg).toEqual("Invitation accepted successfully");
     });

     it("should to failed to accept invitation cause invitaion not found", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user2", password: "12345678" });
          const { token } = authResponse.body;

          const idInvitation = "656fdb24fe72456751b7e3b2";
          const response = await request(app)
               .post("/groups/accept/" + idInvitation)
               .set("Cookie", [`token=${token}`]);
          expect(response.status).toBe(404);
          expect(response.body.message).toEqual("Invitation not found");
     });
});
