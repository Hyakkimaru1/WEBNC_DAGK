import { Button } from "@material-ui/core";
import React, { useContext } from "react";
import "./style.scss";
import UserPlayer from "./UserPlayer/index";
import MeetingRoomOutlinedIcon from "@material-ui/icons/MeetingRoomOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import CurrentBoardPlay from "@/types/CurrentBoardPlay";
import { useHistory, useParams } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import socket from "@/configs/socket";
import { ThemeContext } from "@/contexts/ThemeContext";
import Time from "@/types/Time";
import DialogLeave from "./../DialogLeave";

const Player: React.FC<{
  infBoard: CurrentBoardPlay;
  time: Time;
  user: any;
}> = ({ infBoard, time, user }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const params: any = useParams();
  const [open, setOpen] = React.useState(false);
  const { theme } = useContext(ThemeContext);
  const handleJoinAs = (value: number) => {
    //call socket here
    socket.emit("joinplayas", { id: params.id, value, token });
  };
  return (
    <div className="player">
      <div className="player__user">
        <UserPlayer
          onClick={() => handleJoinAs(0)}
          playKey={0}
          turn={infBoard.turn}
          user={infBoard.playerO}
          time={time.timeO}
          isReady={infBoard.isReady}
        />
      </div>
      <div className="player__count">
        <div className="player__count--point">
          <span style={{ color: theme?.color }}>0</span> <span></span>
          <span style={{ color: theme?.color }}>0</span>
        </div>
      </div>
      <div className="player__user">
        <UserPlayer
          onClick={() => handleJoinAs(1)}
          turn={infBoard.turn}
          user={infBoard.playerX}
          time={time.timeX}
          isReady={infBoard.isReady}
        />
      </div>
      <div className="player__button">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleJoinAs(2)}
        >
          <MeetingRoomOutlinedIcon /> Join as guest
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            if (infBoard.isReady && infBoard.winner === null) {
              console.log(infBoard);
              console.log(user);
              if (
                infBoard.playerX?.name === user.user ||
                infBoard.playerO?.name === user.user
              ) {
                setOpen(true);
              } else {
                history.push(ROUTERS.HOME);
              }
            } else history.push(ROUTERS.HOME);
          }}
        >
          <ExitToAppOutlinedIcon /> Exit
        </Button>
        <DialogLeave open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default React.memo(Player);
