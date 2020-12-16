import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import socket from "@/configs/socket";
import { UserContext } from "@/contexts/UserContext";
import Avatar from "@material-ui/core/Avatar";

const ChatBox = () => {
  const [messages, setmessages] = useState([]);
  const user = useContext(UserContext);

  //get user context

  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.on("message", ({ messages }, callback) => {
      setmessages([...messages]);
    });
    console.table(messages);
  }, [messages]);

  return (
    <div className="chatBox">
      {messages.map((chat) =>
        user.user === chat.user ? (
          <div key={chat.id} className="chatBox__right">
            <p className="chatBox__right--chat">{chat.message}</p>
          </div>
        ) : (
          <div key={chat.id} className="chatBox__left">
            <Avatar src={chat.avatar} />
            <div>
              <p className="chatBox__left--name">{chat.user}</p>
              <p className="chatBox__left--chat">{chat.message}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ChatBox;
