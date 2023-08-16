import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#9c27b0',
      },
    // primary: {
    //   main: "#9eabae",
    // },
    // secondary: {
    //   main: "#80a9ff",
    // },
  },
  typography: {
    expanderButton: {
      fontSize: "1.1rem",
      fontColor: "#fff",
      textAlign: "center",
    },
    filterLabel: {
      fontSize: "1.1rem",
    },
    resultsTitle: {
      fontSize: "1.8rem",
      fontColor: "#80a9ff",
    },
    resultsSubtitle: {
        fontSize: "1.4rem",
        fontColor: "#80a9ff",
    },
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2.6rem",
    },
    h3: {
      fontSize: "2.3rem",
    },
    h4: {
      fontFamily: "Open Sans",
      fontSize: "2rem",
    },
    h5: {
      fontFamily: "Open Sans",
    },
    fontFamily: "Open Sans",
  },
  props: {
    MuiAppBar: {
      color: "secondary",
    },
    MuiTooltip: {
      arrow: true,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h2",
          h2: "h2",
          h3: "h2",
          h4: "h2",
          h5: "h2",
          h6: "h2",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        fontColor: "#fff",
      },
    },
    MuiButton: {
      root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        fontColor: "#fff",
        border: 0,
        padding: 30,
        margin: 5,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 48,
      },
    },
  },
  spacing: 8,
});
export default theme;
