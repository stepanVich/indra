/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  Box, FormControlLabel,
  FormLabel,

  makeStyles,
  Radio,
  RadioGroup,
  RadioProps
} from "@material-ui/core";
import clsx from 'clsx';
import React, { FunctionComponent, Suspense } from "react";
import fetchService from "./services/fetch";
import { RouteMatchProps } from "./components/root";
// import Layout2V from "./components/layouts/layout2V";
//import classes from "*.module.css";

const Layout2V = React.lazy(() => import("./components/layouts/layout2V"));
const Layout3V = React.lazy(() => import("./components/layouts/layout3V"));
const Layout2H = React.lazy(() => import("./components/layouts/layout2H"));

const useStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
  formLabel: {
    color: "black",
  },
});

const Layouts = {
  layout2V: Layout2V,
  layout3V: Layout3V,
  layout2H: Layout2H,
};

/*const Panels = {
  panel1: Panel1,
  panel2: Panel1,
  panel3: Panel1,
};*/

function StyledRadio(props: RadioProps) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export interface PanelOrderAndType {
  order: number;
  type: string;
}

async function getLayoutDefinition(layoutId: number) {
    const json: any = await fetchService.get(process.env.REACT_APP_API_URL_INDRA + '/layout/getLayout/' + layoutId);
  
    return json;
}

const DynamicContent: FunctionComponent<RouteMatchProps> = React.memo(() => {
  const classes = useStyles();

  const [value, setValue] = React.useState<string>("Layout2V");
  const [layoutInstance, setLayoutInstance] = React.useState<any>(<div />);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  // useEffect(() => {
  //   if (value && value == "Layout2V") {
  //       setLayoutInstance(
  //           React.createElement(
  //           Layouts.layout2V,
  //           {
  //               /*panels: [
  //               { order: 1, type: "Panel3", def: "{}" },
  //               { order: 2, type: "Panel2", def: "{}" },
  //               ],*/
  //               layoutId: 1,
  //           },
  //           "XXX"
  //           )
  //       );
  //   }
  //   if (value && value == "Layout3V") {
  //       setLayoutInstance(
  //           React.createElement(
  //           Layouts.layout3V,
  //           {
  //               /*panels: [
  //               { order: 1, type: "Panel3", def: "{}" },
  //               { order: 2, type: "Panel2", def: "{}" },
  //               { order: 3, type: "Panel1", def: "{}" },
  //               ],*/
  //               layoutId: 2,
  //           },
  //           null
  //           )
  //       );
  //   }
  //   if (value && value == "Layout2H") {
  //       setLayoutInstance(
  //           React.createElement(
  //           Layouts.layout2H,
  //           {
  //               /*panels: [
  //               { order: 1, type: "Panel2", def: "{}" },
  //               { order: 2, type: "Panel2", def: "{}" },
  //               ],*/
  //               layoutId: 3,
  //           },
  //           null
  //           )
  //       );
  //   }
  // }, [value]);

  return (
    <>
      <div>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
          style={{ flexDirection: "row" }}
        >
          <Box borderBottom={1} alignItems="center">
            <FormLabel
              style={{ marginRight: 10 }}
              className={classes.formLabel}
            >
              Choose layout:
            </FormLabel>
            <FormControlLabel
              value={"Layout2V"}
              control={<StyledRadio />}
              label="layout2V"
            />
            <FormControlLabel
              value={"Layout3V"}
              control={<StyledRadio />}
              label="layout3V"
            />
            <FormControlLabel
              value={"Layout2H"}
              control={<StyledRadio />}
              label="layout2H"
            />
          </Box>
        </RadioGroup>
      </div>
      <Suspense fallback={<div>Loading...</div>}>{layoutInstance}</Suspense>
    </>
  );
});

export default DynamicContent;
