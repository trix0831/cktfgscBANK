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
import TeamSelect from "../TeamSelect";
import ConstructionIcon from "@mui/icons-material/Construction";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const SetDice = () => {
  const [team, setTeam] = useState(-1);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleTeam = (team) => {
    setTeam(team);
  };

  const handleClick = async () => {
    const payload = { teamId: team };
    await axios.post("/shipRepair", payload);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 9,
          marginBottom: 9,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          Ship Repairing
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <TeamSelect
            label="Team"
            team={team}
            handleTeam={handleTeam}
            hasZero={true}
          />
          <Button
            variant="contained"
            disabled={team === -1}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <ConstructionIcon />
          </Button>
        </FormControl>
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
          Successfully Repaired
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SetDice;
