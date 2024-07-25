import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NPCItems, NavBarItems, adminItems } from "./NavBar/NavBarItem";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import RoleContext from "./useRole";

const Footer = () => {
  const { role } = useContext(RoleContext);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const mapping = (item) => (
    <BottomNavigationAction
      key={item.id}
      label={item.shortLabel}
      icon={item.icon}
      route={item.route}
    />
  );
  useEffect(() => {
    if (role === "admin") {
      setItems(adminItems);
    } else if (role === "NPC") {
      setItems(NPCItems);
    } else {
      setItems(NavBarItems);
    }
  }, [role]);

  return (
    <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(items[newValue].route);
        }}
      >
        {items.map(mapping)}
      </BottomNavigation>

      <Box
        sx={{
          textAlign: "center",  // Centers the text horizontally
          fontSize: "0.8rem",   // Adjusts the text size; you can use different units or values as needed
          top: 0,
        }}
      >
        Website created by 建科37 徐立承
      </Box>
    </AppBar>
  );
};

export default Footer;
