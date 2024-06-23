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
import TeamSelect from "../TeamSelect";

const SetShopLevel = () => {
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [level, setLevel] = useState(1);
  const [amount, setAmount] = useState("0");
  const [showPreview, setShowPreview] = useState(false);
  const { roleId, setNavBarId } = useContext(RoleContext); // eslint-disable-line no-unused-vars
  const navigate = useNavigate();

  const handleTeam = async (team) => {
    if (team === -1) return;
    const getTeamData = async (team) => {
      const { data } = await axios.get("/team/" + team);
      setTeamData(data);
      return data;
    };
    const { level: teamLevel } = await getTeamData(team);
    if (teamLevel === 3) {
      setLevel(3);
    } else if (teamLevel === 2) {
      setLevel(3);
      setAmount(-20000);
    } else {
      setLevel(2);
      setAmount(-10000);
    }
    setTeam(team);
    setShowPreview(true);
  };

  const handleClick = async () => {
    const payload = { teamId: team, level };
    await axios.post("/level", payload); //api
    await axios.post("/add", { id: team, dollar: amount });
    navigate("/teams");
    setNavBarId(2);
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
  }, [roleId, navigate]);

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
          Set Shop Level
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={false}
          />
        </FormControl>
        <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
          <InputLabel id="level-label">Level</InputLabel>
          <Select
            value={level}
            id="level-label"
            onChange={(e) => {
              setLevel(e.target.value);
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
          <Button disabled={team === "Select Team"} onClick={handleClick}>
            Submit
          </Button>
        </FormControl>
        {showPreview && (
          <Box
            sx={{ marginTop: 2 }}
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
              Preview
            </Typography>
            <Typography component="h2" variant="body2" sx={{ marginBottom: 1 }}>
              {teamData.money} &gt;&gt; {teamData.money + parseInt(amount)}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SetShopLevel;
