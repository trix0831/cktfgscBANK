import React, { useContext, useState, useEffect } from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { socket } from "../websocket";
import RoleContext from "./useRole";

const BroadcastAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const { roleId, setPhase } = useContext(RoleContext);

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  useEffect(() => {
    socket.on("broadcast", (args) => {
      // console.log(args.level, roleId);
      // console.log(args);
      if (roleId >= (args.level || 0)) {
        setOpen(true);
        setMessage(args);
        console.log("broadcast", args);
      }
    });

    socket.on("phase", (phase) => {
      setOpen(true);
      setMessage({
        title: `Phase Changed to ${phase}`,
        description: "",
      });
      setPhase(phase);
      console.log("phase", phase);
    });

    return () => {
      socket.off("broadcast");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const broadcastType = (level) => {
    console.log(level);
    if (level === null || level === undefined) return "info";
    else if (level >= 100) return "error";
    else if (level >= 10) return "warning";
    else return "info";
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      sx={{ marginTop: 15 }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        sx={{ width: "100%" }}
        severity={broadcastType(message.level)}
        elevation={6}
        variant="filled"
      >
        <AlertTitle>{String(message.title)}</AlertTitle>
        {String(message.description)} <br />
        {String(message.note || "")}
      </Alert>
    </Snackbar>
  );
};

export default BroadcastAlert;
