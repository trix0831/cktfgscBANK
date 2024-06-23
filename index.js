import http from "http";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";

import db from "./backend/src/mongo.js";
import apiRouter from "./backend/src/api.js";
import socket from "./backend/src/socket.js";

dotenv.config();

const { PORT, MONGO_URL } = process.env;
const port = PORT || 2022;

db.once("open", () => {
  console.log(`MongoDB connected at ${MONGO_URL}`);

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: `http://localhost:${port}`,
      methods: ["GET", "POST"],
    },
  });

  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.static(path.join(process.cwd(), "frontend/build")));
  app.use(function (request, response, next) {
    request.io = io;
    next();
  });

  app.use("/api", apiRouter);
  app.get("/*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "frontend/build", "index.html"));
  });

  socket(io);

  server.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
});
