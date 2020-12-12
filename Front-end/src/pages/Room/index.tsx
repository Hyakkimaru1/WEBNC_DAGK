import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import ChatBox from "./ChatBox";
import Board from "./Board";
import Player from './Player';

const Room: React.FC = () => {
  const params = useParams();
  const { userTheme, theme } = useContext(ThemeContext);

  return (
    <div className="Room">
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
