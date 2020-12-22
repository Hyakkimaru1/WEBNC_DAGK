import React from "react";
import "./style.scss";
import { Avatar } from "@material-ui/core";
import { THEME } from "@/types/Theme";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useHistory } from 'react-router-dom';
import ROUTERS from '@/constants/routers';

const CurrentUser: React.FC<{
  theme?: THEME;
  avatar: string;
  username: string;
}> = ({ theme, avatar, username }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowHistory = () => {
    setAnchorEl(null);
    history.push(ROUTERS.HISTORY);
  }
  const handleLogOut = async () => {
    await localStorage.removeItem("token");
    setAnchorEl(null);
    history.push(ROUTERS.LOGIN);
  }

  const handleOpenProfile = () => {
    setAnchorEl(null);
    history.push(ROUTERS.PROFILE);
  }
  return (
    <div
      className="currentuser"
      style={{ backgroundColor: theme?.backgroundColor }}
    >
      <Avatar style={{ width: "3.5rem", height: "3.5rem" }} src={avatar} />
      <span style={{ color: theme?.color }} className="currentuser__moreOptions" onClick={handleClick}><MoreVertIcon/></span>
      <p style={{ color: theme?.color }}>
        {username}
      </p>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
        <MenuItem onClick={handleShowHistory}>History</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default React.memo(CurrentUser);
