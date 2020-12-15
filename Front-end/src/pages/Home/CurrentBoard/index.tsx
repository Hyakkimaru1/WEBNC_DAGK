import React, { useContext, useRef } from "react";
import BoardPlay from "./BoardPlay";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { callApiCreateBoard } from "@/actions/AddBoardSlide";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";
import { callApiJoinBoard } from "@/actions/JoinBoardSlide";
import { toast } from "react-toastify";

const CurrentBoard: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.AddBoardSlide);
  const stateJoin = useSelector((state: any) => state.JoinBoardSlide);
  const roomIdRef = useRef<HTMLInputElement>(null);

  const handleAddRoom = () => {
    dispatch(callApiCreateBoard());
  };

  const handleJoinRoom = () => {
    if (roomIdRef.current) {
      const _id = roomIdRef.current.value;
      dispatch(
        callApiJoinBoard({
          _id,
          cbSuccess: () => {
            history.push(ROUTERS.ROOM_PUSH + _id);
          },
          cbError: () => {
            toast.error("This room is not existed");
          },
        })
      );
    }
  };

  if (state.id) {
    history.push(ROUTERS.ROOM_PUSH + state.id);
    return <></>;
  }

  return (
    <div className="currentboard">
      <Backdrop
        style={{ backgroundColor: "rgba(255,255,255,.75", zIndex: 111 }}
        open={state.isLoading || stateJoin.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="currentboard__addboard">
        <div className="currentboard__addboard--add">
          <button onClick={handleAddRoom} className="currentboard__button">
            Add room
          </button>
        </div>
        <div className="currentboard__addboard--join">
          <input
            placeholder="id room"
            className="currentboard__input"
            type="text"
            ref={roomIdRef}
          />
          <button onClick={handleJoinRoom} className="currentboard__button">
            Join room
          </button>
        </div>
      </div>
      <div
        style={{ backgroundColor: theme?.backgroundColor }}
        className="currentboard__container"
      >
        <BoardPlay player={1} idroom="123" />
      </div>
    </div>
  );
};

export default React.memo(CurrentBoard);
