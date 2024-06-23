import { React, useState, useContext } from "react";
import { Grid, Paper, Typography, Modal, Box, Button } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HouseIcon from "@mui/icons-material/House";
import RoleContext from "../useRole";
import axios from "axios";

const colors = {
  Go: "rgb(0,0,0)",
  Building: {
    1: "rgb(255,102,102)",
    2: "rgb(255,204,153)",
    3: "rgb(255,255,153)",
    4: "rgb(204,255,153)",
    5: "rgb(153,255,255)",
    6: "rgb(194,163,195)",
  },
  Transport: "rgb(255,93,255)",
  Chance: "rgb(128,0,0)",
  Jail: "rgb(128,128,128)",
  Arena: "rgb(128,128,128)",
  Event: "rgb(0,0,0)",
  Store: "rgb(51,153,255)",
  Game: "rgb(25,73,128)",
  Random: "rgb(153,0,153)",
  Go: "rgb(247,207,0)",
  Bank: "rgb(180,247,141)",
};

const PropertyCard = ({
  id,
  ref,
  type,
  area,
  name,
  owner,
  hawkEye,
  description,
  level,
  expanded,
  price,
  rent,
  buffed,
}) => {
  const [open, setOpen] = useState(false);
  const [buy, setBuy] = useState(0);
  const [upgrade, setUpgrade] = useState(0);
  const { roleId } = useContext(RoleContext);

  const colorData = type === "Building" ? colors[type][area] : colors[type];
  // console.log(ref);
  let levelIcon = [];
  for (let i = 0; i < 3; i++) {
    if (i < level) {
      levelIcon.push(<HomeRoundedIcon style={{ color: "#63f74f" }} key={i} />);
    } else {
      levelIcon.push(
        <HomeRoundedIcon style={{ color: "rgb(160,160,160)" }} key={i} />
      );
    }
  }

  if (hawkEye > 0 && hawkEye !== id) {
    //affected
    levelIcon.push(
      <VisibilityIcon style={{ color: "rgb(225,100,100)" }} key={3} />
    );
  } else if (hawkEye > 0 && hawkEye === id) {
    //self
    levelIcon.push(<VisibilityIcon style={{ color: "#63f74f" }} key={3} />);
  } else if (hawkEye >= 0) {
    levelIcon.push(
      <VisibilityIcon style={{ color: "rgb(160,160,160)" }} key={3} />
    );
  }

  const handleBuff1 = async (name) => {
    const payload = { name: name };
    console.log(name);
    await axios.post("/handleBuff1", payload);
    handleClose();
  };

  const handleBuff2 = async (name) => {
    const payload = { name: name };
    console.log(2);
    await axios.post("/handleBuff2", payload);
  };

  const handleDeBuff = async (name) => {
    const payload = { name: name };
    console.log(0);
    await axios.post("/handleDeBuff", payload);
  };

  const handleView = () => {
    if (type === "Building") {
      setBuy(price.buy);
      setUpgrade(price.upgrade);
      setOpen(true);
    }
    console.log(price.buy);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Paper
        elevation={2}
        key={id}
        id={id}
        ref={ref}
        sx={{
          borderLeft: 10,
          borderColor: colorData,
          paddingTop: 0.5,
          paddingBottom: 0.5,
          minWidth: "100%",
        }}
        onClick={handleView}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h6">{id}</Typography>
          </Grid>
          <Grid item xs>
            <Grid item>
              <Typography
                variant="h6"
                marginTop="1px"
                style={{
                  fontWeight: "600",
                  fontSize: "1.0rem",
                  color:
                    (buffed === 0 && type === "Building") || type !== "Building"
                      ? ""
                      : buffed === 1 && type === "Building"
                      ? "rgb(255,178,14)"
                      : buffed === 2 && type === "Building"
                      ? "rgb(194,0,0)"
                      : "",
                }}
              >
                {name}
              </Typography>
            </Grid>
            {type === "Building" || type === "SpecialBuilding" ? (
              <Grid item>
                <Typography variant="caption">
                  {owner === 0 ? <br /> : `第${owner}小隊`}
                </Typography>
              </Grid>
            ) : (
              <Grid item>
                <Typography variant="caption">{description}</Typography>
              </Grid>
            )}
          </Grid>
          {type === "Building" && (
            <Grid
              item
              xs={5}
              display="flex"
              alignItems="center"
              justifyContent="right"
              paddingRight="5px"
            >
              {levelIcon}
            </Grid>
          )}
        </Grid>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 250,
            margin: 4,
            paddingLeft: 1,
            border: "solid 5px rgb(255,102,102)",
            borderRadius: "5px",
            backgroundColor: "rgb(255,253,236)",
            height: 250,
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 1000 }}
            >
              房產資訊
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80%",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Typography
              id="modal-modal-description-1"
              sx={{ fontWeight: 700 }}
              component="h5"
            >
              {`地產名稱：${name}`}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700 }}
              component="h5"
            >
              {`地產持有人：${owner === 0 ? "無" : `第${owner}小隊`}`}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700 }}
              component="h4"
            >
              {`地產花費： 購買 ${buy}  升級 ${upgrade} `}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700, fontSize: "0.9rem" }}
              component="h5"
            >
              {`過路費： 一級 ${rent[0]} 二級 ${rent[1]} 三級 ${rent[2]} `}
            </Typography>
            <Typography
              id="modal-modal-description-2"
              sx={{ fontWeight: 700 }}
              component="h5"
            >
              {`相同房產增益： ${
                buffed === 0
                  ? "尚未觸發"
                  : buffed === 1
                  ? "已觸發一級增益"
                  : "已觸發二級增益"
              }`}
            </Typography>
          </Box>
          {/* {roleId > 80 ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "20%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                variant="contained"
                sx={{ marginBottom: 1, width: 80 }}
                onClick={() => {
                  handleBuff1(name);
                }}
              >
                buff1
              </Button>
              <Button
                variant="contained"
                sx={{ marginBottom: 1, width: 80 }}
                onClick={() => {
                  handleBuff2(name);
                  handleClose();
                }}
              >
                buff2
              </Button>
              <Button
                variant="contained"
                sx={{ marginBottom: 1, width: 80 }}
                onClick={() => {
                  handleDeBuff(name);
                  handleClose();
                }}
              >
                debuff
              </Button>
            </Box>
          ) : null} */}
        </Box>
      </Modal>
    </>
  );
};

export default PropertyCard;
