import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Stack, Paper, Box } from "@mui/material";
import RoleContext from "../useRole";
import PropertyCard from "./PropertyCard";
import Loading from "../Loading";
import axios from "../axios";

const Properties = () => {
  const { buildings, setBuildings } = useContext(RoleContext);
  const [scrolled, setScrolled] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line no-unused-vars
  const id = parseInt(searchParams.get("id"));
  const refs = React.useMemo(
    () => Array.from({ length: 41 }, (x) => React.createRef()),
    []
  );
  // console.log(id);
  // console.log(refs[id]);

  useEffect(() => {
    const getProperties = async () => {
      await axios
        .get("/land")
        .then((res) => {
          setBuildings(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getProperties();
    const id = setInterval(() => {
      getProperties();
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isNaN(id) && !scrolled && refs[id].current !== null) {
      const position = refs[id].current.getBoundingClientRect().top;
      const offset = window.innerHeight / 2;
      window.scrollTo({
        top: position - offset,
        // behavior: "smooth",
      });
      window.focus();
      setScrolled(true);
      console.log("scrolled");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs[id], scrolled]);

  const cardComponents = buildings.map((item) =>
    PropertyCard({ ...item, ref: refs[item.id] })
  );

  if (buildings.length === 0) {
    return <Loading />;
  } else {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            paddingTop: "80px",
            paddingBottom: "1vh",
            margin: "auto",
          }}
        >
          <Box
            sx={{
              margin: "auto",
            }}
          />
          <Stack
            spacing={2}
            sx={{
              marginLeft: "5vw",
              marginRight: "5vw",
              width: "90vw",
            }}
          >
            {cardComponents}
          </Stack>
          <Box
            sx={{
              marginBottom: "80px",
              marginLeft: "5vw",
              marginRight: "5vw",
            }}
          />
        </Paper>
      </>
    );
  }
};
export default Properties;
