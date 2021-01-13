import React, { useContext, useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import socket from "@/configs/socket";
import { UserContext } from "@/contexts/UserContext";
import Avatar from "@material-ui/core/Avatar";

const ChatBox = () => {
  const [messages, setmessages] = useState([]);
  const user = useContext(UserContext);
  const ulRef = useRef(null); 

  useEffect(() => {
    socket.on("message", ({ messages }, callback) => {
      if (messages)
        {
          setmessages([...messages]);
          if (ulRef.current){
            ulRef.current.scrollTop = ulRef.current.scrollHeight;
          }
        }
    });
    return () => {
      socket.off("message");
    }
  }, []);

  return (
    <div className="chatBox" ref={ulRef}>
      {messages.map((chat,index) =>
        user.user === chat.user ? (
          <div key={index} className="chatBox__right">
            <p className="chatBox__right--chat">{chat.message}</p>
          </div>
        ) : (
          <div key={index} className="chatBox__left">
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
