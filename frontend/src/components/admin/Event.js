import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  Box,
  Button,
  FormControl,
  Alert,
} from "@mui/material";
import Loading from "../Loading";
import RoleContext from "../useRole";
import axios from "../axios";

const Event = () => {
  const [event, setEvent] = useState(0);
  const [message, setMessage] = useState("無");
  const [APIResponse, setAPIResponse] = useState("");
  const [tempPhase, setTempPhase] = useState(1);
  const [events, setEvents] = useState([]);
  const { role, setPhase } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    await axios.post("/event", { id: event }).then((res) => {
      setAPIResponse(res.data);
    });
    // navigate("/notifications");
  };

  const handleClick2 = async () => {
    setPhase(tempPhase);
    await axios.post("/phase", { phase: tempPhase });
    navigate("/notifications");
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/permission");
    }
    axios
      .get("/allEvents")
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (events.length === 0) {
    return <Loading />;
  } else {
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
          <Typography component="h1" variant="h5">
            Event Settings
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="title">Title</InputLabel>
            <Select
              value={event}
              labelId="title"
              onChange={(e) => {
                setEvent(e.target.value);
                setMessage(events[e.target.value].description);
              }}
            >
              {events.map((item) => {
                return (
                  <MenuItem value={item.id} key={events.indexOf(item)}>
                    {item.title}
                  </MenuItem>
                );
              })}
            </Select>
            <TextField
              id="content"
              label="Content"
              multiline
              sx={{ marginTop: 2, marginBottom: 2 }}
              variant="standard"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button disabled={!message} onClick={handleClick}>
              Submit
            </Button>
          </FormControl>
          {APIResponse && <Alert severity="info">{APIResponse}</Alert>}
        </Box>
        {/* <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Phase Settings
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="title">Select Phase</InputLabel>
            <Select
              value={tempPhase}
              onChange={(e) => setTempPhase(e.target.value)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
            <Button onClick={handleClick2} sx={{ marginTop: 2 }}>
              Submit
            </Button>
          </FormControl>
        </Box> */}
      </Container>
    );
  }
};

export default Event;
