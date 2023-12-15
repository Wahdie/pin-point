import mongoose, { Schema, Model } from "mongoose";
import { BaseInvitation } from "./invitationsModel";

interface LocationInterface {
     latitude: string;
     longitude: string;
}

export interface BaseAttendace {
     user: mongoose.Schema.Types.ObjectId;
     group: string;
     photo: string;
     location: LocationInterface;
     tagLocation: string;
     date: Date;
}

const attandanceSchema: Schema<BaseAttendace> = new mongoose.Schema<BaseAttendace>({
     user: { type: mongoose.Schema.Types.ObjectId, required: true },
     group: { type: "string", required: true },
     photo: { type: "string", required: true },
     location: {
          latitude: { type: "string", required: true },
          longitude: { type: "string", required: true },
     },
     tagLocation: { type: "string", required: true },
     date: { type: Date, required: true, default: Date.now },
});

export const AttandanceModel: Model<BaseAttendace> = mongoose.model(
     "AttendanceModel",
     attandanceSchema
);
