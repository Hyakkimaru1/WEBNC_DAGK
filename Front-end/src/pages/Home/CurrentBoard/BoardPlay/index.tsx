import React, { useContext } from "react";
import "./style.scss";
import AccessibleIcon from "@material-ui/icons/Accessible";
import AirlineSeatReclineNormalIcon from "@material-ui/icons/AirlineSeatReclineNormal";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import { useHistory } from "react-router-dom";
import { ThemeContext } from '@/contexts/ThemeContext';

const BoardPlay: React.FC<{ player?: Number; idroom: string | null }> = ({
  player = 2,
  idroom,
}) => {
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  return (
    <div style={{backgroundColor:theme?.backgroundColor}} onClick={() => history.push(`/room/${idroom}`)} className="boardplay">
      <div style={{color:theme?.color}} className="boardplay__idroom">{idroom}</div>
      <div className="boardplay__table">
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
