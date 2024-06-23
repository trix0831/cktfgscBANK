// import React from "react";
import io from "socket.io-client";
// import { usedispatch } from "react-redux";

export const socket = io(process.env.REACT_APP_WS_URL || "localhost:4000");
// export const SocketContext = React.createContext(socket);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log("disconnect");
});
