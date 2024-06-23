import { createContext } from "react";

const RoleContext = createContext({
  navBarId: 0,
  setNavBarId: () => {},
  role: "",
  setRole: () => {},
  roleId: 0,
  setRoleId: () => {},
  teams: [],
  setTeams: () => {},
  phase: 1,
  setPhase: () => {},
  buildings: [],
  setBuildings: () => {},
  filteredBuildings: [],
  setFilteredBuildings: () => {},
});

export default RoleContext;
