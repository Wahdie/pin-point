import mongoose from "../config/db";
import bcrypt from "bcrypt";
import { constants } from "buffer";
import { ObjectId } from "mongodb";

interface user {
     id?: ObjectId;
     username: string;
     email: string;
     role: string;
     password: string;
}
const createUser = async (username: string, email: string, role: string) => {
     const userCollection = mongoose.connection.collection("users");
     const password = await bcrypt.hash("12345678", 10);
     const newUser: user = {
          username,
          email,
          role,
          password,
     };
     const users = await userCollection.insertOne(newUser);
     return { _id: users.insertedId, username, email, role, password };
};

const createGroup = async (name: string, admin: any, member: any[]) => {
     const groupCollection = mongoose.connection.collection("groups");
     const newGroup = {
          name,
          admin,
          member,
     };
     const group = await groupCollection.insertOne(newGroup);
};
export const setupTestData = async () => {
     try {
          const admin = await createUser("admin", "admin@gmail.com", "admin");
          const user1 = await createUser("user1", "user1@gmail.com", "user");
          const user2 = await createUser("user2", "user2@gmail.com", "user");
          const group = await createGroup("Test Group", admin._id, [admin._id, user1._id]);
          // console.log(group);
          console.log("Berhasil setup");
     } catch (error: any) {
          console.error("Error setting up test data:", error.message);
     }
};
