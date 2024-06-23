import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NavBar from "./NavBar/NavBar";
import RoleContext from "./useRole";
import axios from "./axios";

const Header = () => {
  const [open, setOpen] = useState(false);

  const {
    role,
    setRole,
    setRoleId,
    phase,
    setPhase,
    buildings,
    setBuildings,
    filteredBuildings,
    setFilteredBuildings,
  } = useContext(RoleContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleChange = () => {
    setOpen(!open);
  };

  const handleLogin = () => {
    // console.log(role);
    navigate("login");
  };

  const handleLogout = () => {
    // console.log(role);
    setRole("");
    setRoleId(0);
    localStorage.removeItem("role");
    navigate("/"); //set to home later
  };

  const getProperties = async () => {
    await axios
      .get("/land")
      .then((res) => {
        setBuildings(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setFilteredBuildings(
      buildings.filter(
        (building) =>
          building.type === "Building" || building.type === "SpecialBuilding"
      )
    );
  };

  const getPhase = async () => {
    await axios
      .get("/phase")
      .then((res) => {
        setPhase(res.data.phase);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (buildings.length === 0 || filteredBuildings.length === 0) {
      // console.log("get properties");
      getProperties();
    }
    // if (phase === "") {
    //   getPhase();
    // }
    const timer = setInterval(() => {
      // getPhase();
    }, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBuildings, buildings]);

  return (
    <Grid container>
      <AppBar position="fixed" sticky="top">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton onClick={handleChange}>
            <MenuIcon />
            <NavBar open={open} />
          </IconButton>
          <Typography variant="h1">MONOPOLY</Typography>
          <Button
            sx={{ display: pathname === "/login" && "none" }}
            color="inherit"
            onClick={role === "" ? handleLogin : handleLogout}
          >
            {role === "" ? "Login" : "Logout"}
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet />
    </Grid>
  );
};

export default Header;
