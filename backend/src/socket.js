import Land from "../models/land.js";
import Team from "../models/team.js";
import User from "../models/user.js";

// async function updateLand(io) {
//   await Land.find({})
//     .exec()
//     .then((data) => {
//       io.emit("updateLand", data);
//     })
//     .catch((e) => console.error(e));
// }

// async function updateTeam(io) {
//   await Team.find({})
//     .exec()
//     .then((data) => {
//       io.emit("updateTeam", data);
//     })
//     .catch((e) => console.error(e));
// }

// async function updateUser(io) {
//   await User.find({})
//     .exec()
//     .then((data) => {
//       io.emit("updateUser", data);
//     })
//     .catch((e) => console.error(e));
// }

// function updateSession(io) {
//   const { session } = socket.request;
//   if (!session.name) {
//     session.name = "guest";
//   }
//   //   const { name, spaces, notificationReadTime } = session;
//   io.emit("UPDATE_SESSION", { name, spaces, notificationReadTime });
// }

function broadcast(io, data) {
  io.emit("broadcast", data);
}

export default function socket(io) {
  io.on("connection", (socket) => {
    console.log(`A user connected, id = ${socket.id}`);
    // updateSession(socket);
    // updateTeam(socket);
    // updateUser(socket);
    // updateLand(socket);
    socket.on("disconnect", () => {
      console.log(`A user disconnected, id = ${socket.id}`);
    });
  });
}
