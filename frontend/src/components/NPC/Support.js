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
import SendIcon from "@mui/icons-material/Send";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const { buildings } = useContext(RoleContext);
  const [building, setBuilding] = useState(-1);
  const [open, setOpen] = useState(false);
  const { roleId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleBuilding = (building) => {
    setBuilding(building);
  };

  const handleClick = async () => {
    const payload = { title: "Need Help!!", description: building, level: 100 };
    await axios.post("/broadcast", payload);
    setOpen(true);
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
  });

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
          Support
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250 }}>
          <InputLabel id="building">Building</InputLabel>
          <Select
            value={building}
            labelId="building"
            onChange={(e) => {
              handleBuilding(e.target.value);
            }}
          >
            <MenuItem value={-1}>Select Building</MenuItem>
            {buildings.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.id} {item.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            disabled={building === -1}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <SendIcon />
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
          Successfully Sent
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Support;
