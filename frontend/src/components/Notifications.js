import React, { useState, useEffect, useContext } from "react";
import {
  Stack,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  // Table,
  // TableContainer,
  // TableRow,
  // TableCell,
  // TableHead,
  // TableBody,
  // Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "./Loading";
import axios from "./axios";
import RoleContext from "./useRole";

const Notifications = () => {
  const [val, setVal] = useState(0); //tab value
  const [messages, setMessages] = useState([]); //temporary message
  const [permMessages, setPermMessages] = useState([]); //permanent message
  const [eventMessage, setEventMessage] = useState({}); //event
  const [broadcast, setBroadcast] = useState([]); //historical broadcasts
  const [open, setOpen] = useState(false); //snackbar open
  const { roleId } = useContext(RoleContext);

  //tab components
  const handleChange = (e, val) => {
    setVal(val);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index} id={index}>
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };

  const tabprops = (idx) => {
    return { id: idx };
  };

  //fetch data
  const FetchEvent = async () => {
    const { data } = await axios.get("/event");
    if (data !== null) setEventMessage(data); //avoid 0 state
  };

  const FetchMessages = async () => {
    const { data } = await axios.get("/notifications");
    const temporary = data.filter((item) => item.type === "temporary");
    const permanent = data.filter((item) => item.type === "permenant");
    setMessages(temporary);
    setPermMessages(permanent);
  };

  const FetchBroadcast = async () => {
    const { data } = await axios.get("/broadcast");
    setBroadcast(data);
  };

  const handleDelete = async (createdAt) => {
    await axios
      .delete(`/broadcast/${createdAt}`)
      .then((res) => {
        setBroadcast(broadcast.filter((item) => item.createdAt !== createdAt));
        console.log("Successfully deleted");
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    //fetch event, messages, and historical broadcast from backend
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }

    FetchEvent();
    FetchMessages();
    FetchBroadcast();

    // refresh every 15 seconds
    const interval = setInterval(async () => {
      await FetchEvent();
      await FetchMessages();
      await FetchBroadcast();
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TimedComponent = ({ id, duration, title, content, createdAt }) => {
    const [elapsed, setElapsed] = useState(
      duration - Math.floor(Date.now() / 1000 - createdAt)
    );

    useEffect(() => {
      const calculate = () => {
        const temp = duration - Math.floor(Date.now() / 1000 - createdAt);
        // console.log(temp);
        setElapsed(temp);
      };

      const task = setInterval(() => {
        calculate();
      }, 1000);
      return () => clearInterval(task);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (elapsed < 0) return null;
    else
      return (
        <Card key={id} sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={9}>
                <Typography variant="h6">{title}</Typography>
              </Grid>
              <Grid item xs={3} sx={{ alignItems: "flex-end" }}>
                <Typography variant="body1">
                  {Math.floor(elapsed / 60)} :{" "}
                  {elapsed % 60 > 9 ? elapsed % 60 : "0" + (elapsed % 60)}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2">{content}</Typography>
          </CardContent>
        </Card>
      );
  };

  const broadcastType = (level) => {
    if (level === null || level === undefined) return "info";
    else if (level >= 100) return "error";
    else if (level >= 50) return "warning";
    else return "info";
  };

  if (eventMessage.title === undefined) {
    return <Loading />;
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <Box>
          <Tabs
            value={val}
            onChange={handleChange}
            variant="fullWidth"
            sx={{ marginTop: "70px" }}
          >
            <Tab label="current" {...tabprops(0)} />
            {/* <Tab label="history" {...tabprops(1)} /> */}
          </Tabs>
        </Box>

        <TabPanel value={val} index={0}>
          <Stack
            spacing={1}
            sx={{
              maxWidth: 700,
              marginTop: "10px",
              marginLeft: "20px",
              marginRight: "20px",
            }}
          >
            <Card
              sx={{
                backgroundColor: "rgb(60,60,60)",
                color: "rgb(255,255,255)",
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  事件：{eventMessage ? eventMessage.title : "無"}
                </Typography>
                <Typography variant="body2">
                  {eventMessage.description}
                </Typography>
                <Typography variant="body2">{eventMessage.note}</Typography>
              </CardContent>
            </Card>
            {permMessages &&
              permMessages.map((item) => (
                // <Card key={item.id}>
                //   <CardContent>
                //     <Typography variant="subtitle1">{item.title}</Typography>
                //     <Typography variant="body2">{item.description}</Typography>
                //   </CardContent>
                // </Card>
                <Card
                  key={item.id}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            {messages &&
              messages.map((item) => (
                <TimedComponent
                  id={item.id}
                  duration={item.duration}
                  title={item.title}
                  content={item.description}
                  createdAt={item.createdAt}
                />
              ))}
          </Stack>
        </TabPanel>
        <TabPanel value={val} index={1}>
          <Stack
            spacing={1}
            sx={{
              marginTop: "10px",
              marginBottom: 10,
              mx: "auto",
              alignItems: "center",
            }}
          >
            {broadcast &&
              broadcast.map(
                (item) =>
                  roleId >= item.level && (
                    <Alert
                      key={broadcast.indexOf(item)}
                      sx={{ width: "90%" }}
                      severity={broadcastType(item.level)}
                      elevation={6}
                      variant="filled"
                      action={
                        roleId !== 100 ? (
                          <Typography variant="caption">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </Typography>
                        ) : (
                          <IconButton
                            onClick={() => handleDelete(item.createdAt)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <AlertTitle>{String(item.title)}</AlertTitle>
                      {String(item.description)}
                    </Alert>
                  )
              )}
          </Stack>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            sx={{ marginBottom: 10 }}
          >
            <Alert severity="success" variant="filled">
              Successfully deleted
            </Alert>
          </Snackbar>
        </TabPanel>
      </Container>
    );
  }
};
export default Notifications;
