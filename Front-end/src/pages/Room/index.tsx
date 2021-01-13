import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import ChatBox from "./ChatBox";
import Board from "./Board";
import Player from "./Player";
import socket from "@/configs/socket";
import { useParams, useHistory } from "react-router-dom";
import CurrentBoardPlay from "@/types/CurrentBoardPlay";
import { UserContext } from "@/contexts/UserContext";
import {
  createMuiTheme,
  ThemeProvider,
  Button,
  CircularProgress,
} from "@material-ui/core";
import THEME from "@/constants/Theme";
import { toast } from "react-toastify";
import ROUTERS from "./../../constants/routers/index";
import Time from "@/types/Time";

const Room: React.FC = () => {
  //const params = useParams();
  const { userTheme, theme } = useContext(ThemeContext);
  const user: any = useContext(UserContext);
  const params: any = useParams();
  const history = useHistory();
  const [time, setTime] = useState<Time>({ timeX: 0, timeO: 0 });
  const [infBoard, setInfBoard] = useState<CurrentBoardPlay>({
    boardID: params.id, // roomID
    turn: 1,
    board: new Array(25 * 25).fill(null),
    isReady: false,
  });

  const themeMUI = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userTheme === THEME.LIGHT ? "light" : "dark",
        },
      }),
    [userTheme]
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function emitTokenOnBoard() {
      const token = (await localStorage.getItem("token")) || "";
      socket.emit("onboard", { boardID: params.id, token }, (data: any) => {
        if (data) {
          setTime(data);
        } else history.push(ROUTERS.ERROR);
      });
    }
    emitTokenOnBoard();

    return () => {
      socket.emit("leaveroom", { boardId: params.id, token });
    };
  }, [params.id, token, history]);

  useEffect(() => {
    socket.on("getInfBoard", (data: any) => {
      setInfBoard(data);
    });
    socket.on("connect", () => {});

    socket.on("toastwinner", (data: any) => {
      if (data.winner === 0 && data.playerX.name === user.user) {
        toast.warning("😭😢😢 You are lost");
      } else if (data.winner === 0 && data.playerO.name === user.user) {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner");
      } else if (data.winner === 1 && data.playerX.name === user.user) {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner");
      } else if (data.winner === 1 && data.playerO.name === user.user) {
        toast.warning("😭😢😢 You are lost");
      } else {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner But Not You");
      }
    });

    socket.on("updateTime",(data:Time) => {
      setTime(data);
    })

    return () => {
      socket.off("toastwinner");
      socket.off("getInfBoard");
      socket.off("connect");
    };
  }, [user.user]);

  const handleClickBoard = (i: number) => {
    if (infBoard.board) {
      const clone = { ...infBoard };
      clone.board[i] = clone.turn || 0;
      socket.emit("onplay", { infBoard, i, token });
    }
  };

  const readyToNewRound = () => {
    socket.emit("ready", { roomId: params.id, token });
  };

  let isPlay: boolean | undefined;

  if (!infBoard.playerX || !infBoard.playerO) {
    isPlay = false;
  } else {
    isPlay =
      ((infBoard.playerX.name === user.user && infBoard.turn === 1) ||
        (infBoard.playerO.name === user.user && infBoard.turn === 0)) &&
      infBoard.winner === null &&
      infBoard.isReady;
  }

  return (
    <ThemeProvider theme={themeMUI}>
      <div className="Room" style={{ backgroundColor: theme?.backgroundColor }}>
        <div className="Room__player">
          <div className="Room__turn">
            <h3>Turn</h3>{" "}
            <div className="Room__turn--turn">
              {infBoard.turn && infBoard.turn === 1 ? (
                <div className="square__X"></div>
              ) : (
                <div className="square__O"></div>
              )}
            </div>
          </div>
          <Player time={time} infBoard={infBoard} user={user}/>
        </div>
        <div className="Room__board">
          <div className="Room__board--ready">
            {(infBoard.playerO?.name === user.user &&
              (!infBoard.oReady || infBoard.winner)) ||
            (infBoard.playerX?.name === user.user &&
              (!infBoard.xReady || infBoard.winner)) ? (
              <Button
                onClick={readyToNewRound}
                variant="contained"
                color="primary"
              >
                Ready
              </Button>
            ) : (
              <></>
            )}
            {!infBoard.isReady &&
              ((infBoard.xReady && infBoard.playerX?.name === user.user) ||
                (infBoard.oReady && infBoard.playerO?.name === user.user)) && (
                <CircularProgress color="secondary" />
              )}
          </div>
          <Board
            isPlay={isPlay}
            board={infBoard.board}
            current={infBoard?.i}
            onClick={handleClickBoard}
          />
        </div>
        <div className="Room__chat">
          <ChatBox />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default React.memo(Room);
