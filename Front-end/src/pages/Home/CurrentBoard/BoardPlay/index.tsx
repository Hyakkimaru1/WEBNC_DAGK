import React, { useContext } from "react";
import "./style.scss";
import AccessibleIcon from "@material-ui/icons/Accessible";
import AirlineSeatReclineNormalIcon from "@material-ui/icons/AirlineSeatReclineNormal";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import { ThemeContext } from '@/contexts/ThemeContext';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CurrentBoardPlay from '@/types/CurrentBoardPlay';

const BoardPlay: React.FC<{ player?: Number;handleClickJoinRoom: (room:any) => void,room:CurrentBoardPlay }> = ({
  player = 2,
  handleClickJoinRoom,
  room
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div style={{backgroundColor:theme?.backgroundColor}} onClick={() => handleClickJoinRoom(room)} className="boardplay">
      <div style={{color:theme?.color}} className="boardplay__idroom">{room.boardID}</div>
      <div className="boardplay__table">
        {room.hasPassword?<span style={{color:theme?.color}} className="boardplay__table--icon"><LockOutlinedIcon/></span>:null}
        <div className="boardplay__table--left">
        {player>0?<AccessibleIcon />:<></>} 
        </div>
        <div className="boardplay__table--center">
          <FitnessCenterIcon />
        </div>
        <div className="boardplay__table--right">
          {player === 2 ? <AirlineSeatReclineNormalIcon /> : <></>}
        </div>
      </div>
    </div>
  );
};

export default BoardPlay;
