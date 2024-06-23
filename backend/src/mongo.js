import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
dotenv.config();

const db = mongoose.connection;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => console.log("mongoDB connection created"));

db.on("error", console.error.bind(console, "connection error:"));

export default db;
