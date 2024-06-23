import mongoose from "mongoose";
const Schema = mongoose.Schema;
const EffectSchema = new Schema({
  id: Number,
  title: String,
  description: String,
  trait: Number,
  duration: Number,
  bonus: Number,
});

const Effect = mongoose.model("Effect", EffectSchema);
export default Effect;
