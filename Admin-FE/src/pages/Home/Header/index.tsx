// @flow
// libs
import React from "react";
import { useHistory } from "react-router-dom";
// others
import "./styles.scss";
//Material UI
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import { IconButton, Toolbar, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { MenuIcon } from "@material-ui/data-grid";
import { AccountCircle, PeopleOutline, Home } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: "100px",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    icon: {
      height: "30px",
      width: "30px",
    },
    title: {
      flexGrow: 1,
    },
  })
);

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className="header-wrapper">
      <AppBar position="static" style={{ background: "#000a12" }}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Home className={classes.icon} onClick={() => history.push("/")} />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            HOME
          </Typography>
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
          <Typography variant="h6" className={classes.title}>
            USER
          </Typography>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon
              className={classes.icon}
              onClick={() => history.push("/history")}
            />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            HISTORY
          </Typography>
          <IconButton
            className={classes.menuButton}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle className={classes.icon} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
