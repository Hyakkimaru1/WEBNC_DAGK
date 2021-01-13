import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";
import Box from "@material-ui/core/Box";
import { Paper, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./styles.scss";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";
import Home from "@/pages/Home";
import User from "@/pages/User";
import History from "./../../History/index";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ScrollableTabsButtonForce() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    if (newValue === 3) {
      localStorage.removeItem("token");
      history.push(ROUTERS.LOGIN);
    } else setValue(newValue);
  };

  return (
    <div className={`${classes.root} header`}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="HOME" icon={<HomeRoundedIcon />} {...a11yProps(0)} />
          <Tab
            label="USER"
            icon={<AccountCircleRoundedIcon />}
            {...a11yProps(1)}
          />
          <Tab
            label="HISTORY"
            icon={<HistoryRoundedIcon />}
            {...a11yProps(2)}
          />
          <Tab
            label="LOG OUT"
            icon={<ExitToAppRoundedIcon />}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
          <Home />
      </TabPanel>
      <TabPanel value={value} index={1}>
          <User />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <History />
      </TabPanel>
    </div>
  );
}
