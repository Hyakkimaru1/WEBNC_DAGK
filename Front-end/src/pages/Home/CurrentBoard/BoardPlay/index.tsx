import React from "react";
import "./style.scss";
import AccessibleIcon from "@material-ui/icons/Accessible";
import AirlineSeatReclineNormalIcon from "@material-ui/icons/AirlineSeatReclineNormal";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import { useHistory } from "react-router-dom";

const BoardPlay: React.FC<{ player?: Number; idroom: string }> = ({
  player = 2,
  idroom,
}) => {
  const history = useHistory();
  return (
    <div onClick={()=>history.push(`/room/${idroom}`)} className="boardplay">
      <div className="boardplay__idroom">{idroom}</div>
      <div className="boardplay__table">
        <div className="boardplay__table--left">
          <AccessibleIcon />
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
