// @flow
// libs
import React from "react";
import { useHistory } from "react-router-dom";
// others
import "./styles.scss";
//Material UI
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import { IconButton, Menu, MenuItem, Toolbar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { MenuIcon } from "@material-ui/data-grid";
import { AccountCircle, PeopleOutline, Home } from "@material-ui/icons";
import HistoryIcon from "@material-ui/icons/History";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "10%",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-around",
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: "black",
    },
    icon: {
      height: "30px",
      width: "30px",
      color: "black",
    },
    title: {
      flexGrow: 1,
      color: "black",
    },
  })
);

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const handleLogOut = async () => {
    await localStorage.removeItem("token");
    history.push('/login');
  }
  return (
    <div className="header-wrapper">
      <AppBar
        className={classes.root}
        position="static"
        style={{ background: "white" }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Home className={classes.icon} onClick={() => history.push("/")} />
          </IconButton>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <PeopleOutline
              className={classes.icon}
              onClick={() => history.push("/user")}
            />
          </IconButton>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <HistoryIcon
              className={classes.icon}
              onClick={() => history.push("/history")}
            />
          </IconButton>
          <IconButton
            className={classes.menuButton}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <ExitToAppIcon className={classes.icon} onClick = {handleLogOut}/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
