import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import UserChat from "./UserChat/index";
import NewMess from "./NewMess";
import { ThemeContext } from "@/contexts/ThemeContext";
import socket from '@/configs/socket';
import { personInRoom } from "@/types/CurrentBoardPlay";
import { UserContext } from '@/contexts/UserContext';
import { useHistory } from 'react-router-dom';
import ROUTERS from '@/constants/routers';

const ChatBox: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [peopleInRoom,setPeopleInRoom] = useState<personInRoom[]>([]);
  const user:any = useContext(UserContext);
  const history = useHistory();
  useEffect(()=>{
    socket.on("userjoin", (peopleInRoom:personInRoom[]) => {
      if (peopleInRoom.findIndex(e => e.user===user.user) === -1)
      {
        history.push(ROUTERS.HOME);
        return;
      }
      setPeopleInRoom(peopleInRoom);
    })
    return () => {
      socket.off("userjoin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
