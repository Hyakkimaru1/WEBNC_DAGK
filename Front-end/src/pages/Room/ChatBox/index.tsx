import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import UserChat from "./UserChat/index";
import NewMess from "./NewMess";
import { ThemeContext } from "@/contexts/ThemeContext";
import socket from '@/configs/socket';
import { personInRoom } from "@/types/CurrentBoardPlay";

const ChatBox: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [peopleInRoom,setPeopleInRoom] = useState<personInRoom[]>([]);
  useEffect(()=>{
    socket.on("userjoin", (peopleInRoom:personInRoom[]) => {
      setPeopleInRoom(peopleInRoom);
    })
  },[])

  return (
    <div>
      <NewMess />
      <div className="chatbox">
        <ul id="showguest" className="chatbox__chats">
          {
            peopleInRoom.map((ele:personInRoom) => <UserChat key={ele.user} name={ele.user} theme={theme}/>)
          }
        </ul>
      </div>
    </div>
  );
};

export default ChatBox;
