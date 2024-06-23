import React from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";

const TeamSelect = ({ label, team, handleTeam, hasZero, sx }) => {
  return (
    <>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        value={team}
        labelId={label}
        onChange={(e) => {
          handleTeam(e.target.value);
        }}
        sx={sx}
      >
        <MenuItem value={-1}>Select Team</MenuItem>
        {hasZero && <MenuItem value={0}>N/A</MenuItem>}
        <MenuItem value={1}>第01小隊</MenuItem>
        <MenuItem value={2}>第02小隊</MenuItem>
        <MenuItem value={3}>第03小隊</MenuItem>
        <MenuItem value={4}>第04小隊</MenuItem>
        <MenuItem value={5}>第05小隊</MenuItem>
        <MenuItem value={6}>第06小隊</MenuItem>
        <MenuItem value={7}>第07小隊</MenuItem>
        <MenuItem value={8}>第08小隊</MenuItem>
        <MenuItem value={9}>第09小隊</MenuItem>
        <MenuItem value={10}>第10小隊</MenuItem>
      </Select>
    </>
  );
};

export default TeamSelect;
