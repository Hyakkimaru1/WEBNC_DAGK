import React from "react";
import "./style.scss";
import { Avatar } from "@material-ui/core";
import { THEME } from "@/types/Theme";

const CurrentUser: React.FC<{
  theme?: THEME;
  avatar: string;
  username: string;
}> = ({ theme, avatar, username }) => {
  return (
    <div className="currentuser" style={{backgroundColor:theme?.backgroundColor}}>
      <Avatar style={{ width: "3.5rem", height: "3.5rem" }} src={avatar} />
      <p style={{ color: theme?.color }}>{username}</p>
    </div>
  );
};

export default React.memo(CurrentUser);
