import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  Button,
  FormControl,
} from "@mui/material";
import RoleContext from "../useRole";
import axios from "../axios";

const SetOccupation = () => {
  const [team, setTeam] = useState("Select Team");
  const [occupation, setOccupation] = useState("Select Occupation");
  const { roleId, teams, setTeams } = useContext(RoleContext); // eslint-disable-line no-unused-vars
  const navigate = useNavigate();

  const handleClick = async () => {
    const payload = { teamname: team, occupation };
    await axios.post("/occupation", payload);
    navigate("/teams");
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
    // axios
    //   .get("/team")
    //   .then((res) => {
    //     setTeams(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTeam, setOccupation]);

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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Set Occupation
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <InputLabel id="team-label">Team</InputLabel>
          <Select
            value={team}
            id="team-label"
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
          <InputLabel id="occupation-label">Occupation</InputLabel>
          <Select
            value={occupation}
            id="occupation-label"
            onChange={(e) => {
              setOccupation(e.target.value);
            }}
          >
            <MenuItem value={"Select Occupation"}>Select Occupation</MenuItem>
            <MenuItem value={"浩克"}>浩克</MenuItem>
            <MenuItem value={"蟻人"}>蟻人</MenuItem>
            <MenuItem value={"快銀"}>快銀</MenuItem>
            <MenuItem value={"鷹眼"}>鷹眼</MenuItem>
            <MenuItem value={"黑豹"}>黑豹</MenuItem>
            <MenuItem value={"蜘蛛人"}>蜘蛛人</MenuItem>
            <MenuItem value={"薩諾斯"}>薩諾斯</MenuItem>
            <MenuItem value={"黑寡婦"}>黑寡婦</MenuItem>
            <MenuItem value={"美國隊長"}>美國隊長</MenuItem>
            <MenuItem value={"緋紅女巫"}>緋紅女巫</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
          <Button
            disabled={
              team === "Select Team" || occupation === "Select Occupation"
            }
            onClick={handleClick}
          >
            Submit
          </Button>
        </FormControl>
      </Box>
    </Container>
  );
};

export default SetOccupation;
