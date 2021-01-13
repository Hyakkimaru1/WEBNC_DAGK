import React from "react";
import "./style.scss";
import { Avatar, Paper } from "@material-ui/core";
import { THEME } from "@/types/Theme";

const UserChat: React.FC<{ name: string; theme?: THEME }> = ({
  name,
  theme,
}) => {
  return (
    <li>
      <Paper className="chatbox__inputchat" elevation={3}>
        <Avatar />
        <span style={{ color: theme?.text, marginLeft: 7 }}>{name}</span>
      </Paper>
    </li>
  );
};

export default UserChat;
