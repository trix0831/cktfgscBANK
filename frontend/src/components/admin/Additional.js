import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import RoleContext from "../useRole";
import Loading from "../Loading";
import axios from "../axios";

const Additional = () => {
  const [event, setEvent] = useState(0);
  const [title, setTitle] = useState("地產增值(I)");
  const [effects, setEffects] = useState([]);
  const [team, setTeam] = useState("Select Team");
  const [message, setMessage] = useState(
    "使你的房地產租金提升至150%, 效果持續10分鐘。不可疊加使用"
  );
  const [open, setOpen] = useState(false);
  const { roleId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    const payload = { teamname: team, title };
    await axios.post("/effect", payload);
    navigate("/notifications");
  };

  useEffect(() => {
    if (roleId !== 100) {
      navigate("/permission");
    }
    axios
      .get("/allEffects")
      .then((res) => {
        setEffects(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (effects.length === 0) {
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
            Additional Bonus
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="title">Title</InputLabel>
            <Select
              value={event}
              id="title"
              onChange={(e) => {
                setEvent(e.target.value);
                setTitle(effects[e.target.value].title);
                setMessage(effects[e.target.value].description);
              }}
            >
              {effects.map((item) => {
                return (
                  <MenuItem
                    value={effects.indexOf(item)}
                    key={effects.indexOf(item)}
                  >
                    {item.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="team-ownership">Team</InputLabel>
            <Select
              value={team}
              defaultValue="Select Team"
              id="team-ownership"
              onChange={(e) => {
                setTeam(e.target.value);
              }}
            >
              <MenuItem value={"Select Team"}>Select Team</MenuItem>
              <MenuItem value={"第1小隊"}>第1小隊</MenuItem>
              <MenuItem value={"第2小隊"}>第2小隊</MenuItem>
              <MenuItem value={"第3小隊"}>第3小隊</MenuItem>
              <MenuItem value={"第4小隊"}>第4小隊</MenuItem>
              <MenuItem value={"第5小隊"}>第5小隊</MenuItem>
              <MenuItem value={"第6小隊"}>第6小隊</MenuItem>
              <MenuItem value={"第7小隊"}>第7小隊</MenuItem>
              <MenuItem value={"第8小隊"}>第8小隊</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
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
            <Button
              disabled={!(message && team !== "Select Team")}
              onClick={handleClick}
            >
              Submit
            </Button>
          </FormControl>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Notification</DialogTitle>
            <DialogContent>Add event successfully!</DialogContent>
          </Dialog>
        </Box>
      </Container>
    );
  }
};

export default Additional;
