import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Container,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  Button,
  FormControl,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Table,
  // Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PropertyCard from "../Properties/PropertyCard";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Transfer = () => {
  const [from, setFrom] = useState(-1);
  const [fromData, setFromData] = useState({});

  const [to, setTo] = useState(-1);
  const [toData, setToData] = useState({});

  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState({});

  const [count, setCount] = useState(-1);

  const [finalData, setFinalData] = useState({});

  const [amount, setAmount] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const { roleId, filteredBuildings, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleFrom = async (from) => {
    const { data } = await axios.get("/team/" + from);
    // console.log(data);
    setFromData(data);
    setFrom(from);
  };

  const handleTo = async (to, newBuildingData) => {
    const { data: toData } = await axios.get("/team/" + to);
    setToData(toData);
    setTo(to);

    /*if the "to" is not the owner and is affected by hawkeye, 
    then set the price equal to the 40% rent of hawkeye's building */

    // console.log(to !== buildingData.owner);
    // console.log(buildingData.id !== buildingData.hawkEye);
    // console.log(buildingData);
    // if (buildingData === null) return;
    const data = newBuildingData !== undefined ? newBuildingData : buildingData;
    if (to !== data.owner && data.id !== data.hawkEye) {
      const res = await axios.get("/land/" + data.hawkEye);
      console.log(res.data);
      setAmount(Math.round(0.4 * res.data.rent[res.data.level - 1]));
      setErrorMessage("Auto Fill Hawk Eye");
    }
  };

  const FetchFinal = async () => {
    const { data } = await axios.get("/transfer", {
      params: {
        from: from,
        to: to,
        IsEstate: building !== -1,
        dollar: parseInt(amount),
      },
    });
    console.log(data);
    setFinalData(data);
  };

  const handleClick = async () => {
    const payload = {
      from: from,
      to: to,
      IsEstate: building !== -1,
      dollar: parseInt(amount),
    };
    await axios.post("/transfer", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handleBuilding = async (building) => {
    if (building > 0) {
      const { data } = await axios.get("/land/" + building);
      setBuilding(building);
      setBuildingData(data);
      if (data.owner !== 0) {
        handleTo(data.owner, data);
      } else if (data.hawkEye !== 0 && data.id !== data.hawkEye) {
        const { data: hawkEyeTeam } = await axios.get("/team/hawkeye");
        handleTo(hawkEyeTeam.id, data);
        const { data: hawkEyeBuilding } = await axios.get(
          "/land/" + data.hawkEye
        );
        setAmount(
          Math.round(0.4 * hawkEyeBuilding.rent[hawkEyeBuilding.level - 1])
        );
        setErrorMessage("Auto Fill Hawk Eye");
      }

      const res = await axios.post("/series", {
        teamId: data.owner,
        area: data.area,
      });
      const c = res.data.count;
      setCount(res.data.count);

      if (data.type === "Building") {
        if (data.level !== 0) {
          setAmount(data.rent[data.level - 1]);
        }
      } else {
        setAmount(c * 5000);
      }
    } else {
      setBuilding(-1);
      setBuildingData({});
    }
  };

  const handlePercentMoney = async (percent) => {
    // const money = fromData.money; //find the team's money
    const { data } = await axios.get("/getRent", {
      params: { building: building },
    });
    setAmount(Math.round(data * (1 + percent)));
  };

  const handleEqualMoney = () => {
    let money_from = fromData.money; //first team (using the card)
    let money_to = toData.money; //second team(passive)
    let temp = Math.round((money_from - money_to) / 2);
    setAmount(temp);
  };

  useEffect(() => {
    if (roleId < 10) {
      navigate("/permission");
    }
    // axios
    //   .get("/team")
    //   .then((res) => {
    //     setTeams(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  useEffect(() => {
    if (from !== -1 && to !== -1 && amount !== 0 && from !== to) {
      FetchFinal();
    }
  }, [from, to, amount]); // eslint-disable-line react-hooks/exhaustive-deps

  const PreviewBuilding = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" component="h2">
          Preview Building
        </Typography>
        <PropertyCard {...buildingData} />

        {buildingData.type === "Building" ? (
          <TableContainer component={Paper}>
            <Table aria-label="rent-table" size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <HomeRoundedIcon />
                  </TableCell>
                  <TableCell align="center">
                    <HomeRoundedIcon />
                    <HomeRoundedIcon />
                  </TableCell>
                  <TableCell align="center">
                    <HomeRoundedIcon />
                    <HomeRoundedIcon />
                    <HomeRoundedIcon />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">{buildingData.rent[0]}</TableCell>
                  <TableCell align="center">{buildingData.rent[1]}</TableCell>
                  <TableCell align="center">{buildingData.rent[2]}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}

        <Typography variant="body1" component="p">
          Series Count: {count}
        </Typography>
      </Box>
    );
  };

  const PreviewTransfer = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 1,
          width: "100%",
        }}
      >
        <Typography variant="h6" component="h2">
          Preview Transfer
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="transfer-preview" size="small">
            <TableBody>
              <TableRow>
                <TableCell align="center">Transfer</TableCell>
                <TableCell align="center">From</TableCell>
                <TableCell align="center">To</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Team</TableCell>
                <TableCell align="center">{from}</TableCell>
                <TableCell align="center">{to}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Before</TableCell>
                <TableCell align="center">{fromData.money}</TableCell>
                <TableCell align="center">{toData.money}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">After</TableCell>
                <TableCell align="center">{finalData.from}</TableCell>
                <TableCell align="center">{finalData.to}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
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
        }}
      >
        <Typography component="h1" variant="h5">
          Transfer Money
        </Typography>
        <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 0 }}>
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
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <TeamSelect
            label="From.."
            team={from}
            handleTeam={handleFrom}
            hasZero={false}
          />
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <TeamSelect
            label="To.."
            team={to}
            handleTeam={handleTo}
            hasZero={false}
            sx={{ marginBottom: 2 }}
          />
        </FormControl>

        {/* <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 1 }}
        >
          <FormLabel mx="auto">Is Concerning Estate?</FormLabel>
          <Stack
            direction="row"
            spacing="auto"
            alignItems="center"
            mx={5}
            mt={2}
          >
            <Typography>No</Typography>
            <Switch
              checked={isEstate}
              onChange={(e) => {
                setIsEstate(e.target.checked);
              }}
              label="Is concerning estate"
              size="large"
            />
            <Typography>Yes</Typography>
          </Stack>
        </FormControl> */}
        <FormControl
          variant="standard"
          sx={{ minWidth: "250px", marginTop: 2 }}
        >
          {/* <TextField
            required
            label="Amount"
            id="amount"
            value={amount}
            sx={{ marginTop: 2, marginBottom: 2 }}
            onChange={(e) => {
              setAmount(e.target.value);
              setEqual(false);
            }}
          /> */}
          <TextField
            required
            error={error}
            label="Amount"
            id="amount"
            value={amount}
            onChange={(e) => {
              const re = /^[0-9\b]+$/;
              if (e.target.value === "" || re.test(e.target.value)) {
                setAmount(e.target.value ? e.target.value : "");
                setErrorMessage("");
                setError(false);
              } else {
                setErrorMessage("Please enter a valid number");
                setError(true);
              }
            }}
            helperText={errorMessage}
            FormHelperTextProps={{ error: true }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {/* <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={handleEqualMoney}
            >
              Equal
            </Button> */}
            <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.5)}
            >
              raise
            </Button>

            {/* <Button
              variant="contained"
              sx={{ marginBottom: 1 }}
              disabled={to === -1 || from === -1}
              onClick={() => handlePercentMoney(0.1)}
            >
              10%
            </Button> */}
          </Box>
          {/* <Button
            disabled={!(from && to && amount) || from === to}
            onClick={handleClick}
          >
            Submit
          </Button> */}
          <Button
            variant="contained"
            disabled={!(from && to && amount) || from === to}
            onClick={handleClick}
            fullWidth
            sx={{ marginTop: 0 }}
          >
            <SendIcon />
          </Button>
        </FormControl>
        {building !== -1 ? <PreviewBuilding /> : null}
        {from !== -1 && to !== -1 ? <PreviewTransfer /> : null}
      </Box>
    </Container>
  );
};
export default Transfer;
