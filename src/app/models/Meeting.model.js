import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HolovoxUser",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["host", "participant"],
    default: "participant",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HolovoxUser",
      required: true,
    },

    participants: [ParticipantSchema], // host + clients
  },
  {
    timestamps: true,
  }
);

const MeetingModel =
  mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);

export default MeetingModel;