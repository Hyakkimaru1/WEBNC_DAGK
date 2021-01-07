// @flow
// libs
import React from "react";
import { useHistory } from "react-router-dom";
// others
import "./style.scss";
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import RecentActorsOutlinedIcon from '@material-ui/icons/RecentActorsOutlined';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const useStyles = makeStyles({
  root: {
    width: 500,
    alignItems: 'center',
  },
});


const Home = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <div className="home-wrapper">
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="History" icon={<RestoreIcon />} href = "/history"/>
      <BottomNavigationAction label="User" icon={< RecentActorsOutlinedIcon />} href = "/user"/>
      <BottomNavigationAction label="My account" icon={<PermIdentityIcon />} href = "/account"/>
    </BottomNavigation>
   </div>
  )
 
  };

export default Home;
