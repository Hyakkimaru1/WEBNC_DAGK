import React from "react";
import "./style.scss";
import UserPlayer from './UserPlayer/index';

const Player: React.FC = () => {
  return (
    <div className="player">
      <div className="player__user"><UserPlayer/></div>
      <div className="player__count"><div className="player__count--point"><span>0</span> <span></span><span>0</span></div></div>
      <div className="player__user"><UserPlayer/></div>
    </div>
  );
};

export default Player;
