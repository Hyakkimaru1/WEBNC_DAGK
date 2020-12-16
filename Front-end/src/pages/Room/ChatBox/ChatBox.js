import { Avatar, Button, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useParams } from "react-router-dom";
//import { socket } from "socket.io-client";
import socket from "@/configs/socket";
import "./ChatBox.css";


const ChatBox = () => {
  const [messages, setmessages] = useState([]);
  const token = localStorage.getItem("token");
  const params = useParams();
  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   if (message) {
  //     console.log(message);
  //     socket.emit("sendMess", { roomId: params.id, token, message }, () =>
  //       setmessage("")
  //     );
  //   }
  // };

  //Get user context
  const user = useContext(UserContext);
  useEffect(() => {
    //socket.on('eventname',(data) => {
    //  setChats
    //})

    socket.on("messagesUpdated",(messages) => {
     setmessages(messages);
    })
  }, []);
  const chatRef = useRef(null);
  return (
    <div className="chatBox">
      <div>
      
        {
          messages.map(message =>
              user.user === message.user ?
              (
                  <div key={message.id} className='chatBox__right'>
                      <p className="chatBox__right--chat">{message.message}</p>
                  </div>
              ) :
              (
                  <div key={message.id} className='chatBox__left'>
                      <Avatar src={message.avatar}/>
                      <div>
                          <p className='chatBox__left--name'>{message.user}</p>
                          <p className="chatBox__left--chat">{message.message}</p>
                      </div>
                  </div>
              )
          )
        }
      </div>
    </div>
  );
};

export default ChatBox;
