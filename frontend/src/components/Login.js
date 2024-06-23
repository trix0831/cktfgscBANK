import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import RoleContext from "./useRole";
// import { socket } from "../websocket";
import axios from "./axios";

export const roleIdMap = {
  第01小隊: 1,
  第02小隊: 2,
  第03小隊: 3,
  第04小隊: 4,
  第05小隊: 5,
  第06小隊: 6,
  第07小隊: 7,
  第08小隊: 8,
  第09小隊: 9,
  第10小隊: 10,
  NPC: 50,
  admin: 100,
};

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setRole, setRoleId } = useContext(RoleContext);

  const handleClick = async () => {
    // post /api/login
    const payload = { username: user, password: password };
    const {
      data: { username },
    } = await axios.post("/login", payload);
    // console.log(username);
    if (username !== "") {
      // success!
      setOpen(true);
      setMessage("Successfully login!");
      setRole(username);
      const id = roleIdMap[username];
      setRoleId(id);
      // console.log(roleIdMap[username]);
      localStorage.setItem("role", username);
      navigate("/");
    } else {
      //failed
      setRole("");
      setRoleId(0);
      setMessage("Wrong Username or Password.");
      setOpen(true);
    }
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
          Login
        </Typography>
        <FormControl variant="standard">
          <TextField
            required
            label="Username"
            id="user"
            autoComplete="user"
            type="text"
            sx={{ marginTop: 1, marginBottom: 1 }}
            autoFocus
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
          <TextField
            required
            label="Password"
            id="password"
            autoComplete="current-password"
            type="password"
            sx={{ marginTop: 1, marginBottom: 1 }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            sx={{ marginTop: 1 }}
            disabled={!(user && password)}
            onClick={handleClick}
          >
            Login
          </Button>
        </FormControl>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={message === "Successfully login!" ? "success" : "warning"}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
