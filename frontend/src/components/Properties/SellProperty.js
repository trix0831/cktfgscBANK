import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Box,
  FormControl,
  Checkbox,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "../axios";
import RoleContext from "../useRole";

const SellProperty = () => {
  const [teamData, setTeamData] = useState({});
  const [ownedBuildings, setOwnedBuildings] = useState([]);
  const [building, setBuilding] = useState(-1);
  const [buildingData, setBuildingData] = useState([]);
  const [price, setPrice] = useState(0);
  const [forced, setForced] = useState(false);
  const { roleId, role, setNavBarId } = useContext(RoleContext);
  const navigate = useNavigate();

  const handleBuilding = (building) => {
    setBuilding(building);
    let temp;
    const land = ownedBuildings.find((land) => land.id === parseInt(building));
    if (land.type === "Building") {
      temp = land.price.buy + land.price.upgrade * (land.level - 1);
    } else {
      temp = land.price.buy;
    }
    setPrice(Math.round(temp / 2));
  };

  const handleSubmit = async () => {
    const payload = { teamId: roleId, landId: building, forced };
    console.log(payload);
    await axios.post("/sell", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  useEffect(() => {
    if (role === "") {
      navigate("/permission");
    }

    const getOwnedBuildings = async () => {
      await axios
        .get("/property/" + roleId)
        .then((res) => {
          setOwnedBuildings(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const getTeamData = async () => {
      await axios
        .get("/team/" + roleId)
        .then((res) => {
          setTeamData(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    const getBuildingData = async () => {
      await axios
        .get("/land")
        .then((res) => {
          setBuildingData(
            res.data.filter(
              (land) =>
                (land.type === "Building" || land.type === "SpecialBuilding") &&
                land.owner !== 0
            )
          );
        })
        .catch((error) => {
          console.error(error);
        });
    };

    if (roleId < 10) {
      getOwnedBuildings();
      getTeamData();
    } else {
      getBuildingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  if (roleId < 10) {
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
          <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
            Sell Property
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 0 }}>
            <RadioGroup
              onChange={(e) => {
                handleBuilding(e.target.value);
              }}
            >
              <TableContainer sx={{ maxHeight: "50vh" }}>
                <Table stickyHeader sx={{ maxwidth: "90vw" }}>
                  <TableHead>
                    <TableRow key={-1}>
                      <TableCell>Building</TableCell>
                      <TableCell>Auc. Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ownedBuildings.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <FormControlLabel
                            value={item.id}
                            label={`${item.id} ${item.name}`}
                            control={<Radio />}
                          />
                        </TableCell>
                        <TableCell>
                          {item.type === "Building"
                            ? Math.round(
                                (item.price.buy +
                                  item.price.upgrade * (item.level - 1)) /
                                  2
                              )
                            : Math.round(item.price.buy)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </RadioGroup>
            <Button
              variant="contained"
              disabled={building === -1}
              onClick={handleSubmit}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              <SendIcon />
            </Button>
          </FormControl>
          {building !== -1 ? (
            <>
              <Typography component="h1" variant="h6" sx={{ marginBottom: 1 }}>
                Preview
              </Typography>
              <Typography
                component="h2"
                variant="body2"
                sx={{ marginBottom: 1 }}
              >
                {teamData.money} &gt;&gt; {teamData.money + price}
              </Typography>
            </>
          ) : null}
        </Box>
      </Container>
    );
  } else {
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
          <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
            Sell Property
          </Typography>
          <FormControl variant="standard" sx={{ minWidth: 250, marginTop: 2 }}>
            <InputLabel id="building">Building</InputLabel>
            <Select
              value={building}
              labelId="building"
              onChange={(e) => {
                setBuilding(e.target.value);
              }}
            >
              <MenuItem value={-1}>Select Building</MenuItem>
              {buildingData.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.id} {item.name}
                </MenuItem>
              ))}
            </Select>
            <FormControlLabel
              control={<Checkbox />}
              label="Forced"
              onChange={(e) => {
                setForced(e.target.checked);
              }}
            />
            <Button
              variant="contained"
              disabled={building === -1}
              onClick={handleSubmit}
              fullWidth
              sx={{ marginTop: 2 }}
            >
              <SendIcon />
            </Button>
          </FormControl>
        </Box>
      </Container>
    );
  }
};
export default SellProperty;
