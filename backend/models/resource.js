import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ResourceSchema = new Schema({
  id: Number,
  name: String,
  price: Number,
});

const Resource = mongoose.model("Resource", ResourceSchema);
export default Resource;
