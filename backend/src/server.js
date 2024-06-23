import { Server } from "socket.io";
import http from "http";
import https from "https";
import mongoose from "mongoose";
import express from "express";
// import session from "express-session";
import dotenv from "dotenv-defaults";
import fs from "fs";
import path from "path";
// import redis from "ioredis";
// import connectRedis from "connect-redis";
// import { v4 as uuid_v4 } from "uuid";
import morgan from "morgan";
import cors from "cors";

import apiRouter from "./api.js";
import socket from "./socket.js";

dotenv.config();

const db = mongoose.connection;

if (process.env.NODE_ENV === "development") {
  console.log("NODE_ENV = development");
}

const { NODE_ENV, HTTPS, PORT, REDIS_URL, SESSION_PREFIX, MONGO_URL } =
  process.env;

const port = PORT || 4000;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MongoDB connected");

  const app = express();

  let server;
  let protocal = "http";
  if (NODE_ENV === "development" && HTTPS) {
    console.log("Use https in development");
    protocal = "https";
    const { SSL_CRT_FILE, SSL_KEY_FILE } = process.env;
    const key = fs.readFileSync(SSL_KEY_FILE, "utf8");
    const cert = fs.readFileSync(SSL_CRT_FILE, "utf8");
    server = https.createServer({ key, cert }, app);
  } else {
    server = http.createServer(app);
  }

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  // app.locals.io = io;

  // const redisClient = redis.createClient(6379, REDIS_URL);
  // redisClient.on("error", console.error);

  // const RedisStore = connectRedis(session);

  // const sessionOptions = {
  //   cookie: {
  //     path: "/",
  //     httpOnly: true,
  //     secure: true,
  //     maxAge: null,
  //   },
  //   resave: false,
  //   saveUninitialized: false,
  //   secret: uuid_v4(),
  //   unset: "destroy",
  //   store: new RedisStore({
  //     client: redisClient,
  //     prefix: SESSION_PREFIX,
  //   }),
  // };

  // sessionOptions.store.clear();

  // if (NODE_ENV === "development" && !HTTPS) {
  // sessionOptions.cookie.secure = false;
  // console.log("Secure cookie is off");
  // }
  // if (NODE_ENV === "production") {
  //   console.log("NODE_ENV = production");
  //   app.set("trust proxy", 1);
  //   console.log("Trust proxy is on");
  // }

  // const sessionMiddleware = session(sessionOptions);

  // io.use((socket, next) => {
  //   sessionMiddleware(socket.request, socket.request.res || {}, next);
  // });

  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.header("Access-Control-Allow-Origin", "http://trader.asuscomm.com");
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   res.header(
  //     "Access-Control-Allow-Methods",
  //     "POST, GET, PUT, DELETE, OPTIONS"
  //   );
  //   res.header("Access-Control-Allow-Credentials", "true");
  //   next();
  // });
  // init middleware
  // if (process.env.NODE_ENV === "production") {
  //   const __dirname = path.resolve();
  //   app.use(express.static(path.join(__dirname, "../frontend", "build")));
  // }
  app.use(express.json());
  app.use(cors());
  // app.use(sessionMiddleware);
  app.use(morgan("dev"));
  // app.use(express.static(path.join(process.cwd(), "build")));
  app.use(function (request, response, next) {
    request.io = io;
    next();
  });

  app.use("/api", apiRouter);

  // app.get("/*", (req, res) => {
  //   res.sendFile(path.join(process.cwd(), "build", "index.html"));
  // });

  socket(io);

  server.listen(port, () =>
    console.log(`App listening at ${protocal}://localhost:${port}`)
  );
});
