import React from "react";
import { Container, Box } from "@mui/system";
import { Typography, Button, Grid, useTheme } from "@mui/material";
// import {useTheme} from "@mui/core/styles";
import LockIcon from "@mui/icons-material/Lock";
const PermissionDenied = () => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mx="auto"
      minHeight="100vh"
    >
      <Container align="center">
        <LockIcon style={{ color: theme.palette.primary.main, fontSize: 60 }} />
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          You do not have permission to access this page.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" href="/">
              Back to Home
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" href="/login">
              Login
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PermissionDenied;
