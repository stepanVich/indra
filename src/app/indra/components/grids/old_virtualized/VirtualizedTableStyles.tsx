import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";

export const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
      },
      "& .ReactVirtualized__Table__Grid": {
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      },
      "& .MuiTableCell-root": {
        paddingTop: 4,
        paddingBottom: 4,
      },
    },
    tableRow: {
      cursor: "pointer",
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: "initial",
    },
  });

declare module "@material-ui/core/styles/withStyles" {
  // Augment the BaseCSSProperties so that we can control jss-rtl
  interface BaseCSSProperties {
    flip?: boolean;
  }
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

//const classes = useStyles();
