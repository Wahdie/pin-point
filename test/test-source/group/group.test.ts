import { app } from "../../config/app";
import request from "supertest";

describe("Group Test", () => {
     it("should be success to create a new group", async () => {
          const newGroup = {
               name: "Bardosono",
          };
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/groups")
               .set("Cookie", [`token=${token}`])
               .send(newGroup);
          // console.log(authResponse.body);
          // console.log(response.body);
          expect(response.status).toBe(201);
          expect(response.body.msg).toEqual("success");
     });
     it("should be failed to create a new group cause a duplikat", async () => {
          const newGroup = {
               name: "Bardosono",
          };
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/groups")
               .set("Cookie", [`token=${token}`])
               .send(newGroup);
          // console.log(authResponse.body);
          // console.log(response.body);
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(["Nama group sudah digunakan!"]);
     });

     it("should be failed to create a new group", async () => {
          const newGroup = {
               name: "",
          };
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .post("/groups")
               .set("Cookie", [`token=${token}`])
               .send(newGroup);
          // console.log(authResponse.body);
          // console.log(response.body);
          expect(response.status).toBe(400);
          expect(response.body.message).toEqual(["Nama group tidak boleh kosong"]);
     });
     it("should be success to get all of group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const getGroups = await request(app)
               .get("/groups")
               .set("Cookie", [`token=${token}`]);
          // console.log(authResponse.body);
          // console.log(response.body);
          expect(getGroups.status).toBe(200);
          expect(getGroups.body.groups).toBeDefined();
     });

     it("should be failed to get all of group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user1", password: "12345678" });
          const { token } = authResponse.body;
          const getGroups = await request(app)
               .get("/groups")
               .set("Cookie", [`token=${token}`]);
          // console.log(authResponse.body);
          // console.log(response.body);
          expect(getGroups.status).toBe(403);
          expect(getGroups.body.groups).toBeUndefined();
          expect(getGroups.body.message).toEqual("Akses  ditolak. Anda bukan admin");
     });

     it("should be success to get group by id", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);
          const idGroup = response.body.groups[0]._id;
          const getGroups = await request(app)
               .get(`/groups/${idGroup}`)
               .set("Cookie", [`token=${token}`]);
          expect(getGroups.status).toBe(200);
          expect(getGroups.body.group.name).toEqual("Test Group");
     });
     it("should be success to update group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);
          const idGroup = response.body.groups[0]._id;
          const updateGroups = await request(app)
               .put(`/groups/${idGroup}`)
               .set("Cookie", [`token=${token}`])
               .send({
                    name: "Groups",
               });
          expect(updateGroups.status).toBe(200);
          expect(updateGroups.body.result.name).toEqual("Groups");
          // console.log(updateGroups.body.result.name)
     });
     it("should be failed to update group cause duplicate name", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);
          const idGroup = response.body.groups[0]._id;
          const updateGroups = await request(app)
               .put(`/groups/${idGroup}`)
               .set("Cookie", [`token=${token}`])
               .send({
                    name: "Bardosono",
               });
          expect(updateGroups.status).toBe(400);
          expect(updateGroups.body.message).toEqual(["Nama sudah digunakan"]);
          // console.log(updateGroups.body)
     });
     it("should be success to delete group", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "admin", password: "12345678" });
          const { token } = authResponse.body;
          const response = await request(app)
               .get("/groups/")
               .set("Cookie", [`token=${token}`]);
          const idGroup = response.body.groups[1]._id;
          const deleteGroups = await request(app)
               .delete(`/groups/${idGroup}`)
               .set("Cookie", [`token=${token}`]);
          expect(deleteGroups.status).toBe(200);
          expect(deleteGroups.body.msg).toEqual("Group deleted succesfully");
          // console.log(deleteGroups.body)
     });
     it("should be failed to update group cause not admin", async () => {
          const authResponse = await request(app)
               .post(`/auth/login`)
               .send({ username: "user1", password: "12345678" });
          const { token } = authResponse.body;
          const updateGroups = await request(app)
               .put(`/groups/657abebcdcb1db52b65aa964 `)
               .set("Cookie", [`token=${token}`])
               .send({
                    name: "Groups",
               });
          expect(updateGroups.status).toBe(403);
          expect(updateGroups.body.message).toEqual("Akses  ditolak. Anda bukan admin");
     });
});
