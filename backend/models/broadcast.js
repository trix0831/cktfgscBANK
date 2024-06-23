import mongoose from "mongoose";
const Schema = mongoose.Schema;
const BroadcastSchema = new Schema({
  createdAt: Number,
  title: String,
  description: String,
  level: Number,
});

const Broadcast = mongoose.model("broadcast", BroadcastSchema);
export default Broadcast;
