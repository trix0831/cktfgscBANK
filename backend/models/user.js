import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
});

userSchema.statics.findAndValidate = async function (username, password) {
  const user = await this.findOne({ username });
  if (!user) {
    return null;
  }
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
};

userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
