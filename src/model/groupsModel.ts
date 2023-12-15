import mongoose, { Schema, Model } from "mongoose";

export interface BaseGroups {
     name: string;
     admin: string;
     member: Array<string>;
}

const groupSchema: Schema<BaseGroups> = new mongoose.Schema<BaseGroups>({
     name: { type: "string", required: true },
     admin: { type: "string", required: true },
     member: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const GroupModel: Model<BaseGroups> = mongoose.model<BaseGroups>("Groups", groupSchema);
