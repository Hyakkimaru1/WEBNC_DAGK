import React, { useContext, useEffect } from "react";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import ChatBox from "./ChatBox";
import Board from "./Board";
import Player from './Player';
import socket from '@/configs/socket';
import { useParams } from "react-router-dom";

const Room: React.FC = () => {
  //const params = useParams();
  const {theme } = useContext(ThemeContext);
  const params:any = useParams(); 
  useEffect(() => {
    async function emitTokenOnBoard(){
      const token = await localStorage.getItem("token") || "";
      socket.emit("onboard",{boardID:params.id,token});
    }
    emitTokenOnBoard();
  }, [params.id]);
  socket.on('getInfBoard',(data:any)=>{
    console.log(data);
  })
  return (
    <div className="Room" style={{backgroundColor:theme?.backgroundColor}}>
      <div className="Room__chat">
          <ChatBox/>
      </div>
      <div className="Room__board">
          <Board/>
      </div>
      <div className="Room__player">
          <Player/>
      </div>
    </div>
  );
};

export default Room;
