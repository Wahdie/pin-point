import mongoose, { Schema, Model } from "mongoose";

export interface BaseUser {
     username: string;
     email: string;
     password: string;
     role: string;
     
}

const userSchema: Schema<BaseUser> = new mongoose.Schema({
     username: { type: "string", required: true },
     email: { type: "string", required: true },
     password: { type: "string", required: true },
     role: { type: "string", required: true, enum: ["user"], default: "user" },
});

export const UserModel: Model<BaseUser> = mongoose.model<BaseUser>("User", userSchema);
