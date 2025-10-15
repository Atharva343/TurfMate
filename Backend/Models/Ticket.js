import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  turfId: {
    type: String,
    required: true,
  },
  turfName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  numberOfPlayers: {
    type: Number,
    required: true,
  },
  interestedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
