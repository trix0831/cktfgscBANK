import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  TableRow,
  Container,
  Box,
  TextField,
  FormControl,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import RoleContext from "../useRole";
import SendIcon from "@mui/icons-material/Send";
import FunctionsIcon from "@mui/icons-material/Functions";
import Loading from "../Loading";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Bank = () => {
  const { teams, setTeams } = useContext(RoleContext);
  const [team, setTeam] = useState(-1);
  const [teamData, setTeamData] = useState({});
  const [amount, setAmount] = useState("0");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { roleId, setNavBarId } = useContext(RoleContext); // eslint-disable-line no-unused-vars

  const navigate = useNavigate();

  const columns = [
    { id: "teamname", label: "Team", minWidth: "10vw", align: "center" },
    // { id: "dice", label: "Dice", minWidth: "5vw", align: "center" },
    { id: "deposit", label: "Deposit", minWidth: "17vw", align: "center" },
    // { id: "resources", label: "Resources", minWidth: "17vw", align: "center" },
  ];

  const handleTeam = async (team) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    const { data } = await axios.get("/team/" + team);
    // console.log(data);
    setTeamData(data);
    setTeam(team);
  };

  const handleAmount = async (amount) => {
    if (amount !== "-" && amount !== "" && team !== -1) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
    setAmount(amount);
  };

  const handleSubmit = async () => {
    const payload = {
      id: team,
      dollar: parseInt(amount) ? parseInt(amount) : 0,
    };
    await axios.post("/deposit", payload);
    navigate("/teams");
  };

  // const handleAccounting = async () => {
  //   await axios.post("/accounting");
  //   navigate("/teams");
  // };

  const getTeams = async () => {
    axios
      .get("/team")
      .then((res) => {
        setTeams(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const SimpleMoneyButton = ({ val }) => {
    return (
      <Button
        variant="contained"
        disabled={team === -1}
        sx={{ marginBottom: 1, width: 80 }}
        onClick={() => {
          if (!amount) {
            handleAmount(val);
          } else {
            handleAmount(parseInt(amount) + val);
          }
        }}
      >
        {val > 0 ? "+" : ""}
        {val}
      </Button>
    );
  };

  useEffect(() => {
    getTeams();
    const id = setInterval(() => {
      getTeams();
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (teams.length === 0) {
    return <Loading />;
  } else {
    return (
      <>
        {roleId > 20 ? (
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 9,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5" sx={{ marginBottom: 0 }}>
                Deposit
              </Typography>
              <FormControl variant="standard" sx={{ minWidth: 250 }}>
                <TeamSelect
                  label="Team"
                  team={team}
                  handleTeam={handleTeam}
                  hasZero={false}
                />

                <TextField
                  required
                  label="Amount"
                  id="amount"
                  value={amount}
                  sx={{ marginTop: 2, marginBottom: 1 }}
                  onChange={(e) => {
                    const re = /^-?[0-9\b]+$/;
                    if (
                      e.target.value === "-" ||
                      e.target.value === "" ||
                      re.test(e.target.value)
                    ) {
                      if (Math.abs(parseInt(e.target.value)) > 1000000) {
                        setErrorMessage("Too Large");
                      } else {
                        handleAmount(e.target.value ? e.target.value : "");
                        setErrorMessage("");
                      }
                    } else {
                      setErrorMessage("Please enter a valid number");
                    }
                  }}
                  helperText={errorMessage}
                  FormHelperTextProps={{ error: true }}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <SimpleMoneyButton val={+100} />
                  <SimpleMoneyButton val={+1000} />
                  <SimpleMoneyButton val={+5000} />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <SimpleMoneyButton val={-100} />
                  <SimpleMoneyButton val={-1000} />
                  <SimpleMoneyButton val={-5000} />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        disabled={team === -1 || amount === ""}
                        onClick={handleSubmit}
                        fullWidth
                      >
                        <SendIcon />
                      </Button>
                    </Box>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                    >
                      <Button
                        variant="contained"
                        onClick={handleAccounting}
                        fullWidth
                      >
                        <FunctionsIcon />
                      </Button>
                    </Box>
                  </Grid> */}
                </Grid>
              </FormControl>
            </Box>
          </Container>
        ) : null}


        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            paddingTop: "60px",
            paddingBottom: "60px",
            marginLeft: "2vw",
            marginRight: "2vw",
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 900,
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((item) => (
                    <TableCell
                      key={item.id}
                      align={item.align}
                      style={{
                        minWidth: item.minWidth,
                        fontWeight: "800",
                        userSelect: "none",
                      }}
                    >
                      {item.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((item) => {
                  return (
                    <TableRow key={item.teamname}>
                      {columns.map((column) => {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ userSelect: "none" }}
                          >
                            {column.id === "money"
                              ? Math.round(item[column.id]) > 0
                                ? Math.round(item[column.id])
                                : "破產"
                              : column.id === "resources"
                              ? `Gold: ${item[column.id].gold}, Meat: ${
                                  item[column.id].meat
                                }, Cola: ${item[column.id].cola}, Wood: ${
                                  item[column.id].wood
                                }, Metal: ${item[column.id].wood}`
                              : item[column.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </>
    );
  }
};

export default Bank;
