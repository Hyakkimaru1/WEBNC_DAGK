import React from "react";
import "./style.scss";
import UserPlayer from './UserPlayer/index';

const Player: React.FC = () => {
  return (
    <div className="player">
      <div className="player__user"><UserPlayer/></div>
      <div className="player__count"><div className="player__count--point">0-0</div></div>
      <div className="player__user"><UserPlayer/></div>
    </div>
  );
};

export default Player;
