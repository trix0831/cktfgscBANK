import mongoose from "mongoose";
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  id: Number,
  type: String,
  teamname: String,
  title: String,
  description: String,
  duration: Number,
  createdAt: Number,
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
