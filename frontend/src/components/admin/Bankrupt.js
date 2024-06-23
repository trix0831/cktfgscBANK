import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Paper,
  Typography,
  Button,
  Modal,
} from "@mui/material";
import RoleContext from "../useRole";
import Shop2Icon from "@mui/icons-material/Shop2";
import TeamSelect from "../TeamSelect";
import axios from "../axios";

const Bankrupt = () => {
  const [team, setTeam] = useState(-1);
  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});
  const [amount, setAmount] = useState(0);
  const { role } = useContext(RoleContext);
  const [open, setOpen] = useState(false);
  const { filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    const payload = { id: team, amount: amount };
    await axios.post("/set", payload);
    setOpen(true);
  };

  const handleBuilding = async (building) => {
    console.log(team);
    console.log(filteredBuildings);
    const { data } = await axios.get("/land/" + building);
    setBuilding(building);
    setBuildingData(data);
  };

  const handleSoldOut = async () => {
    const payload = { id: team, building: building };
    await axios.post("/soldout", payload);
    navigate("/properties?id=" + buildingData.id);
    setNavBarId(3);
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
        <Typography component="h1" variant="h5" sx={{ marginBottom: 0 }}>
          Bankrupt
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={setTeam}
            hasZero={false}
          />
        </FormControl>
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
            {filteredBuildings.map((item) =>
              item.owner === team && item.buffed === 0 ? (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ) : null
            )}
          </Select>
          <Button
            variant="contained"
            disabled={building === -1 || team === -1}
            onClick={handleSoldOut}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <Shop2Icon />
          </Button>
        </FormControl>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Set complete</Typography>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Bankrupt;
