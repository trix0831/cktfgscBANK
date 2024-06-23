import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Container,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import RoleContext from "../useRole";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PropertyCard from "../Properties/PropertyCard";
import TeamSelect from "../TeamSelect";
import SendIcon from "@mui/icons-material/Send";
import axios from "../axios";
import Shop2Icon from "@mui/icons-material/Shop2";
import { useNavigate } from "react-router-dom";

const Random = () => {
  const [team, setTeam] = useState(-1);
  const [mode, setMode] = useState(-1);
  const [level, setLevel] = useState(1);
  // mode 0: 收購, mode 1: 交換
  const [open, setOpen] = useState(false);
  const [otherTeam, setOtherTeam] = useState(-1);
  const [building, setBuilding] = useState(-1);
  const [otherBuilding, setOtherBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});
  const [otherBuildingData, setOtherBuildingData] = useState({});
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleMode = (mode) => {
    setMode(mode);
  };

  const handleTeam = (team) => {
    setTeam(team);
  };

  const handleBuilding = async (building) => {
    const { data } = await axios.get("/land/" + building);
    setBuilding(building);
    setBuildingData(data);
  };

  const handleOtherBuilding = async (building) => {
    const { data } = await axios.get("/land/" + building);
    setOtherBuilding(building);

    setOtherBuildingData(data);
    setOtherTeam(data.owner);
  };

  const handleAquire = async () => {
    const payload = { land: buildingData.name, teamId: team };
    await axios.post("/aquire", payload);
    setOpen(true);
    navigate("/properties?id=" + buildingData.id);
    setNavBarId(3);
    await axios.post("calcbonus", {
      teamId: team,
      land: buildingData.name,
      level: 0,
    });
  };

  const checkBonus = async (team, name) => {
    console.log(team, name);
    await axios.post("/calcbonus", {
      teamId: team,
      land: name,
      level: 0,
    });
  };

  const handleExchange = async () => {
    const payload = {
      land: buildingData.name,
      otherLand: otherBuildingData.name,
      teamId: team,
      otherTeamId: otherTeam,
    };
    await axios.post("/exchange", payload);
    setOpen(true);
    navigate("/properties?id=" + buildingData.id);
    setNavBarId(3);

    checkBonus(team, buildingData.name);
    checkBonus(otherTeam, otherBuildingData.name);
  };

  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 9,
          marginBottom: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Functions for Random Grid
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <InputLabel id="mode">Mode</InputLabel>
          <Select
            value={mode}
            labelId="mode"
            onChange={(e) => {
              handleMode(e.target.value);
            }}
          >
            <MenuItem value={-1}>Select Mode</MenuItem>
            <MenuItem value={0}>Acquire 10:16 ~ 10:40</MenuItem>
            <MenuItem value={1}>Exchange 10:41 ~ 11:10</MenuItem>
          </Select>
          {mode === -1 ? (
            <FormControl
              variant="standard"
              sx={{ minWidth: 250, marginTop: 0 }}
            >
              <Button
                variant="contained"
                disabled={mode === -1}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                <SendIcon />
              </Button>
            </FormControl>
          ) : mode === 0 ? (
            <>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <TeamSelect
                  label="Team"
                  team={team}
                  handleTeam={handleTeam}
                  hasZero={true}
                />
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="building">Building</InputLabel>
                <Select
                  value={building}
                  labelId="building"
                  onChange={(e) => {
                    handleBuilding(e.target.value);
                  }}
                >
                  <MenuItem value={-1}>Select Building</MenuItem>
                  {filteredBuildings.map((item) =>
                    item.owner !== 0 &&
                    item.owner !== team &&
                    item.level === 1 ? (
                      <MenuItem value={item.id} key={item.id}>
                        {item.id} {item.name}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
                <Button
                  variant="contained"
                  disabled={mode === -1}
                  onClick={handleAquire}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  <Shop2Icon />
                </Button>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <TeamSelect
                  label="Team"
                  team={team}
                  handleTeam={handleTeam}
                  hasZero={true}
                />
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="building">Building to be Changed</InputLabel>
                <Select
                  value={building}
                  labelId="building"
                  onChange={(e) => {
                    handleBuilding(e.target.value);
                  }}
                >
                  <MenuItem value={-1}>Select Building</MenuItem>
                  {filteredBuildings.map((item) =>
                    item.owner === team ? (
                      <MenuItem value={item.id} key={item.id}>
                        {item.id} {item.name}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="building">Other Buildings</InputLabel>
                <Select
                  value={otherBuilding}
                  labelId="building"
                  onChange={(e) => {
                    handleOtherBuilding(e.target.value);
                  }}
                >
                  <MenuItem value={-1}>Select Building</MenuItem>
                  {filteredBuildings.map((item) =>
                    item.owner !== 0 &&
                    item.owner !== team &&
                    item.level === 1 ? (
                      <MenuItem value={item.id} key={item.id}>
                        {item.id} {item.name}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
                <Button
                  variant="contained"
                  disabled={mode === -1}
                  onClick={handleExchange}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  <PublishedWithChangesIcon sx={{ margin: 1 }} />
                </Button>
              </FormControl>
            </>
          )}
        </FormControl>

        {!(team === -1 || building === -1) && mode === 0 ? (
          <>
            <Typography component="h2" variant="h6" sx={{ marginBottom: 2 }}>
              Preview
            </Typography>
            <PropertyCard {...buildingData} hawkEye={-1} />
            <KeyboardDoubleArrowDownIcon sx={{ margin: 1 }} />
            <PropertyCard {...buildingData} owner={team} hawkEye={-1} />
          </>
        ) : !(team === -1 || building === -1 || otherBuilding === -1) ? (
          <>
            <Typography component="h2" variant="h6" sx={{ marginBottom: 2 }}>
              Preview
            </Typography>
            <PropertyCard {...buildingData} owner={team} hawkEye={-1} />
            <ImportExportIcon />
            <PropertyCard
              {...otherBuildingData}
              owner={otherTeam}
              hawkEye={-1}
            />
          </>
        ) : null}
      </Box>
      <Snackbar
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        autoHideDuration={2000}
        sx={{ marginBottom: 10 }}
      >
        <Alert severity="success" variant="filled">
          Successfully Sent
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Random;
