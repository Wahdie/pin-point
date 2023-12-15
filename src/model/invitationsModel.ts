import mongoose, { Schema, Model } from "mongoose";

export interface BaseInvitation {
     senderId: string;
     receiverEmail: string;
     groupId: string;
     status: string;
     isUpdate: boolean;
}

const InvitatioSchema: Schema<BaseInvitation> = new mongoose.Schema({
     senderId: { type: "string", required: true },
     receiverEmail: { type: "string", required: true },
     groupId: { type: "string", required: true },
     status: {
          type: "string",
          required: true,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
     },
     isUpdate: { type: "boolean", required: true, default: false },
});

export const InvitationModel: Model<BaseInvitation> = mongoose.model<BaseInvitation>(
     "Invitation",
     InvitatioSchema
);


