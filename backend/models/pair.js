import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PairSchema = new Schema({
  key: String,
  value: Number,
});

const Pair = mongoose.model("Pair", PairSchema);
export default Pair;
