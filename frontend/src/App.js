import React, { useState } from "react";
import Header from "./components/Header";
import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ThemeProvider } from "@mui/material/styles";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import Teams from "./components/Teams/Teams";
import Login from "./components/Login";
import AddMoney from "./components/NPC/AddMoney";
import Event from "./components/admin/Event";
import Bank from "./components/admin/Bank";
import PermissionDenied from "./components/PermissionDenied";
import Footer from "./components/Footer";
import RoleContext from "./components/useRole";
import Loading from "./components/Loading";
import BroadcastAlert from "./components/BroadcastAlert";
import Broadcast from "./components/admin/Broadcast";
import { roleIdMap } from "./components/Login";
import theme from "./theme";

const App = () => {
  const localRole = localStorage.getItem("role");
  const [navBarId, setNavBarId] = useState(0);
  const [role, setRole] = useState(localRole ? localRole : "");
  const [roleId, setRoleId] = useState(localRole ? roleIdMap[role] : 0);
  const [teams, setTeams] = useState([]);
  const [phase, setPhase] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const value = {
    navBarId,
    setNavBarId,
    role,
    setRole,
    roleId,
    setRoleId,
    teams,
    setTeams,
    phase,
    setPhase,
    buildings,
    setBuildings,
    filteredBuildings,
    setFilteredBuildings,
  };

  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <RoleContext.Provider value={value}>
        <Header />
        <BroadcastAlert />
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            timeout={300}
            classNames="fade"
            unmountOnExit
            in={true}
            appear={true}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="teams" element={<Teams />} />
              <Route path="login" element={<Login />} />
              <Route path="addmoney" element={<AddMoney />} />
              <Route path="event" element={<Event />} />
              <Route path="loading" element={<Loading />} />
              {/* <Route path="bank" element={<Bank />} /> */}
              <Route path="broadcast" element={<Broadcast />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </RoleContext.Provider>
    </ThemeProvider>
  );
};

const Root = () => <BrowserRouter><App /></BrowserRouter>;

export default Root;
