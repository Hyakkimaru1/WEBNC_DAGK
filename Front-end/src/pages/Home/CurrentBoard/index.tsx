import React, { useContext, useRef, useState } from "react";
import BoardPlay from "./BoardPlay";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  NativeSelect,
  InputLabel,
} from "@material-ui/core";
import { callApiCreateBoard } from "@/actions/AddBoardSlide";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";
import { callApiJoinBoard } from "@/actions/JoinBoardSlide";
import { toast } from "react-toastify";
import CurrentBoardPlay from "@/types/CurrentBoardPlay";
import socket from "@/configs/socket";

const CurrentBoard: React.FC<{ boards: CurrentBoardPlay[] }> = ({ boards }) => {
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = React.useState(false);
  const [openJoin, setOpenJoin] = React.useState(false);
  const [value, setValue] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.AddBoardSlide);
  const stateJoin = useSelector((state: any) => state.JoinBoardSlide);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordJoinRef = useRef<HTMLInputElement>(null);
  const [roomJoinId, setRoomJoinID] = useState<string | null>("");
  const token = localStorage.getItem("token");
  const [time, setTime] = React.useState<{ time: number; name: string }>({
    time: 300,
    name: "5 min",
  });

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof state;
    setTime({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleQuickJoin = () => {
    socket.emit("quickJoin", token, (boardID: string) => {
      if (boardID) {
        history.push(ROUTERS.ROOM_PUSH + boardID);
      } else {
        toast.error("There is no room available!");
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddRoom = () => {
    if (passwordRef.current) {
      if (passwordRef.current.value.trim() === "") {
        toast.error("Please enter password");
        return;
      }
      const params = {
        hasPassword: value,
        password: passwordRef.current.value,
        time:time.time,
      };
      dispatch(
        callApiCreateBoard({
          params,
          cbSuccess: (id: string) => history.push(ROUTERS.ROOM_PUSH + id),
          cbError: () => {
            toast.error("😢 Something wrong!");
            setOpen(false);
          }
        })
      );
    } else {
      const params = {
        hasPassword: value,
        password: "",
        time:time.time
      };
      dispatch(
        callApiCreateBoard({
          params,
          cbSuccess: (id: string) => history.push(ROUTERS.ROOM_PUSH + id),
        })
      );
    }
  };

  const handleJoinRoom = () => {
    if (roomIdRef.current) {
      //check if the room is need password or not
      setRoomJoinID(roomIdRef.current.value);
      socket.emit(
        "joinboard",
        { boardID: roomIdRef.current.value },
        (value: any) => {
          if (value) {
            setOpenJoin(true);
          } else {
            toast.error("This room is not existed");
          }
        }
      );
    }
  };

  const handleClickJoinRoom = (room: CurrentBoardPlay) => {
    if (room.hasPassword) {
      setRoomJoinID(room.boardID);
      setOpenJoin(true);
    } else {
      history.push(`/room/${room.boardID}`);
    }
  };

  const handleJoinRoomByPassword = () => {
    //check password in server then redirect or show error
    if (passwordJoinRef.current) {
      const params = {
        _id: roomJoinId,
        password: passwordJoinRef.current.value,
        socketId: socket.id,
      };
      dispatch(
        callApiJoinBoard({
          params,
          cbSuccess: () => {
            history.push(ROUTERS.ROOM_PUSH + roomJoinId);
          },
          cbError: () => {
            toast.error("Wrong Password");
          },
        })
      );
    }
  };

  return (
    <div className="currentboard">
      <Backdrop
        style={{ backgroundColor: "rgba(255,255,255,.75", zIndex: 100000 }}
        open={state.isLoading || stateJoin.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="currentboard__addboard">
        <div className="currentboard__addboard--add">
          <button onClick={handleClickOpen} className="currentboard__button">
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
        <div className="currentboard__addboard--quick-join">
          <button onClick={handleQuickJoin} className="currentboard__button">
            Quick join
          </button>
        </div>
      </div>
      <div
        style={{ backgroundColor: theme?.backgroundColor }}
        className="currentboard__container"
      >
        {boards?.map((ele) => {
          if (ele.playerO && ele.playerX) {
            return (
              <BoardPlay
                handleClickJoinRoom={handleClickJoinRoom}
                key={ele.boardID}
                player={2}
                room={ele}
              />
            );
          } else if (ele.playerO || ele.playerX) {
            return (
              <BoardPlay
                handleClickJoinRoom={handleClickJoinRoom}
                key={ele.boardID}
                player={1}
                room={ele}
              />
            );
          } else {
            return (
              <BoardPlay
                handleClickJoinRoom={handleClickJoinRoom}
                key={ele.boardID}
                player={0}
                room={ele}
              />
            );
          }
        })}
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle style={{ width: 370 }}>Create A Room</DialogTitle>

        <DialogContent>
          <div style={{ display: "grid", gridTemplateColumns: "60% 40%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={() => {
                    setValue(!value);
                  }}
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
              }
              label="Password"
            />
            <FormControl>
              <InputLabel htmlFor="age-native-simple">Play time</InputLabel>
              <NativeSelect
                value={time.time}
                onChange={handleChange}
                name="time"
                inputProps={{ "aria-label": "time" }}
              >
                <option value={300}>5 min</option>
                <option value={420}>7 min</option>
                <option value={600}>10 min</option>
              </NativeSelect>
            </FormControl>
          </div>

          {value ? (
            <TextField
              autoFocus
              label="Enter password"
              type="password"
              inputRef={passwordRef}
              required
              fullWidth
            />
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddRoom} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openJoin}
        onClose={() => setOpenJoin(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle style={{ width: 370 }}>Enter the Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Enter password"
            type="password"
            inputRef={passwordJoinRef}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoin(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleJoinRoomByPassword} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(CurrentBoard);
