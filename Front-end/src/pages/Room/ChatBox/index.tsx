import React, { useRef, useState } from "react";
import "./style.scss";
import {TextField, Button } from "@material-ui/core";
import UserChat from './UserChat/index';
import ChatBox from './ChatBox'
import socket from "@/configs/socket";
import { useParams } from "react-router-dom";


type mess = {
  user:string,
  message: string
}
const ChatBoxx: React.FC = () => {
  const params : any = useParams();
  const token = localStorage.getItem("token");
  const chatRef = useRef(null);
  const [messages, setmessages] = useState<mess[]>([]);
  const [message, setmessage] = useState<string>("");
  
  const sendMessage = (event:any) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMess", { roomId: params.id, token, message }, () =>
        {
          setmessage("");
        });
      }
  };
  //get user cont

  return (
    <div className="chatbox">
        <ul className="chatbox__chats">
           {/*<ChatBox/>*/}
          {/* <UserChat name="duy" text="chat here"/>
          <UserChat name="duy" text="chat here"/>
          <UserChat name="duy" text="chat here"/> */}
        </ul>
        <div className="chatbox__inputchat">
          <TextField
             value = {message}
             inputRef={chatRef}
             id="outlined-basic"
             variant="outlined"
             onChange={(event) => setmessage(event?.target.value)}
             onKeyPress={(event) =>
             event.key === "Enter" ? sendMessage(event) : null}
             
          />
          <Button 
          variant="contained" 
          color="primary"
          >
            Chat
          </Button>
        </div>
    </div>
  );
};

export default ChatBoxx;
