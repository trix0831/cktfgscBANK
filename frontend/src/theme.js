import { createTheme } from "@mui/material";

// const palette = {
//   primary: {
//     main: "#009be5",
//   },
//   secondary: {
//     main: "#006db3",
//   },
//   error: {
//     main: "#f44336",
//   },
//   success: {
//     main: "#4caf50",
//   },
//   warning: {
//     main: "#ffeb3b",
//   },
// };

const palette = {
  primary: {
    main: "#0b6b20",
  },
  secondary: {
    main: "#EFA53A",
  },
  error: {
    main: "#f44336",
  },
  success: {
    main: "#4caf50",
  },
  warning: {
    main: "#EFA53A",
  },
};

const theme = createTheme({
  palette,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderRadius: 8.5,
          textTransform: "none",
          // "&.MuiButton-contained": {
          //   backgroundColor: palette.primary.main,
          //   "&:hover": {
          //     backgroundColor: palette.secondary.main,
          //   },
          // },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1.7rem",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          "& .MuiBottomNavigationAction-root, .Mui-selected, svg": {
            color: "#fff",
          },
          backgroundColor: palette.primary.main,
        },
      },
    },
  },
  typography: {
    //fontFamily: "Merriweather",
    fontSize: 14,
    h1: {
      fontSize: "1.6rem",
      fontWeight: 600,
      color: "#fff",
      letterSpacing: "0.5px",
      textTransform: "capitalize",
    },
    h6: {
      fontSize: "1.2rem",
    },
    body2: {
      fontSize: "1rem",
    },
  },
});
export default theme;
