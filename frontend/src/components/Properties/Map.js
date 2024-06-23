import React, { useContext, useState, useEffect } from "react";
import { Box, Typography, FormControl, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Map = () => {
  return (
    <Container>
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
          Game Map
        </Typography>
        <img
          src="/map.png"
          alt="Map"
          style={{
            maxWidth: "100%",
            userSelect: "none",
          }}
        />
      </Box>
    </Container>
  );
};

export default Map;
