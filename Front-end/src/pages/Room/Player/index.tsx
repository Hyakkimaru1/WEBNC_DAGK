import { Button } from "@material-ui/core";
import React from "react";
import "./style.scss";
import UserPlayer from './UserPlayer/index';
import MeetingRoomOutlinedIcon from '@material-ui/icons/MeetingRoomOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

const Player: React.FC = () => {
  return (
    <div className="player">
      <div className="player__user"><UserPlayer/></div>
      <div className="player__count"><div className="player__count--point"><span>0</span> <span></span><span>0</span></div></div>
      <div className="player__user"><UserPlayer/></div>
      <div>
        <Button variant="outlined" color="primary"><MeetingRoomOutlinedIcon/> Join as guess</Button>
        <Button variant="outlined" color="secondary"><ExitToAppOutlinedIcon/> Exit</Button>
      </div>
    </div>
  );
};

export default Player;
