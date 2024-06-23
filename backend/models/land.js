import mongoose from "mongoose";
const Schema = mongoose.Schema;
const LandSchema = new Schema({
  id: Number,
  type: String,
  name: String,
  area: Number,
  owner: Number,
  //hawkEye: Number,
  description: String,
  level: Number,
  buffed: Number,
  price: { buy: Number, upgrade: Number },
  rent: [Number],
});

const Land = mongoose.model("Land", LandSchema);
export default Land;
