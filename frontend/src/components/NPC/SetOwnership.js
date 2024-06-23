import React, { useState, useEffect, useContext } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import PropertyCard from "../Properties/PropertyCard";
import Loading from "../Loading";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const SetOwnership = () => {
  const [team, setTeam] = useState(-1);
  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});
  const [level, setLevel] = useState(1);
  const [prefill, setPrefill] = useState(false);
  const [open, setOpen] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line no-unused-vars
  const prefillTeams = searchParams.get("team");
  const prefillBuilding = searchParams.get("id");
  // console.log(prefillBuilding);
  // console.log(prefillTeams);

  const handleClick = async () => {
    const payload = { teamId: team, land: buildingData.name, level };
    await axios.post("/ownership", payload);
    navigate("/properties?id=" + buildingData.id);
    setNavBarId(3);
    await axios.post("/calcbonus", payload);
  };

  const handleTeam = (team) => {
    if (team === 0) {
      setLevel(0);
    }
    setTeam(team);
  };

  const handleBuilding = async (building) => {
    const { data } = await axios.get("/land/" + building);
    setBuilding(building);
    setBuildingData(data);
    if (data.type === "Building") {
      setLevel(data.level + 1);
    } else {
      setLevel(0);
    }
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
    if (!prefill && prefillBuilding !== null && prefillTeams !== null) {
      handleTeam(parseInt(prefillTeams));
      handleBuilding(parseInt(prefillBuilding));
      setPrefill(true);
      console.log("prefilled");
    } else {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillBuilding, prefillTeams]);

  if (filteredBuildings.length === 0) {
    return <Loading />;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Set Ownership
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="building">Building</InputLabel>
            <Select
              value={building}
              labelId="building"
              onChange={(e) => {
                handleBuilding(e.target.value);
              }}
            >
              <MenuItem value={-1}>Select Building</MenuItem>
              {filteredBuildings.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <TeamSelect
              label="Team"
              team={team}
              handleTeam={handleTeam}
              hasZero={true}
            />
            {team !== buildingData.owner && team !== -1 && building !== -1 ? (
              <FormHelperText error={true}>Owner has Change!!!</FormHelperText>
            ) : null}
          </FormControl>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="level-building">Building Level</InputLabel>
            <Select
              value={level}
              labelId="level-building"
              disabled={team === 0}
              onChange={(e) => {
                setLevel(e.target.value);
              }}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
            {level - buildingData.level !== 1 &&
            team !== -1 &&
            buildingData.type === "Building" &&
            building !== -1 ? (
              <FormHelperText error={true}>
                Not Upgrading 1 level!!!
              </FormHelperText>
            ) : null}
            {/* <Button
              disabled={team === -1 || building === -1}
              onClick={handleClick}
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button> */}
            <Button
              variant="contained"
              disabled={team === -1 || building === -1}
              onClick={handleClick}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              <SendIcon />
            </Button>
          </FormControl>
          {!(team === -1 || building === -1) ? (
            <>
              <Typography component="h2" variant="h6" sx={{ marginBottom: 2 }}>
                Preview
              </Typography>
              <PropertyCard {...buildingData} hawkEye={-1} />
              <KeyboardDoubleArrowDownIcon />
              <PropertyCard
                {...buildingData}
                level={level}
                owner={team}
                hawkEye={-1}
              />
            </>
          ) : null}
        </Box>
        <Snackbar open={open} onClose={handleClose} sx={{ marginBottom: 10 }}>
          <Alert
            onClose={handleClose}
            sx={{ width: "100%" }}
            severity={"warning"}
            elevation={6}
            variant="filled"
          >
            Not from Add Money!
          </Alert>
        </Snackbar>
      </Container>
    );
  }
};

export default SetOwnership;
