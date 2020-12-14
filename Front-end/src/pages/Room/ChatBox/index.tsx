import React, { useRef } from "react";
import "./style.scss";
import {TextField, Button } from "@material-ui/core";
import UserChat from './UserChat/index';

const ChatBox: React.FC = () => {
  const chatRef = useRef(null);
  return (
    <div className="chatbox">
        <ul className="chatbox__chats">
          <UserChat name="duy" text="chat here"/>
          <UserChat name="duy" text="chat here"/>
          <UserChat name="duy" text="chat here"/>
        </ul>
        <div className="chatbox__inputchat">
          <TextField
            inputRef={chatRef}
            id="outlined-basic"
            variant="outlined"
          />
          <Button variant="contained" color="primary">
            Chat
          </Button>
        </div>
    </div>
  );
};

export default ChatBox;
