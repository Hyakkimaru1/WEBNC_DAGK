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
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import THEME from "@/constants/Theme";
import { toast } from "react-toastify";
import ROUTERS from "./../../constants/routers/index";

const Room: React.FC = () => {
  //const params = useParams();
  const { userTheme, theme } = useContext(ThemeContext);
  const user: any = useContext(UserContext);
  const params: any = useParams();
  const history = useHistory();
  const [infBoard, setInfBoard] = useState<CurrentBoardPlay>({
    boardID: params.id, // roomID
    playerX: null, // store userID or username
    playerO: null,
    turn: 1,
    board: new Array(25 * 25).fill(null),
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

  //user online
  const roomN = "1";

  socket.emit("join", { token, roomN }, (error: any) =>
    console.log("error", error)
  );

  useEffect(() => {
    async function emitTokenOnBoard() {
      const token = (await localStorage.getItem("token")) || "";
      socket.emit("onboard", { boardID: params.id, token }, () => {
        history.push(ROUTERS.ERROR);
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
      if (data.winner === 0 && data.playerX === user.user) {
        toast.warning("😭😢😢 You are lost");
      } else if (data.winner === 0 && data.playerO === user.user) {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner");
      } else if (data.winner === 1 && data.playerX === user.user) {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner");
      } else if (data.winner === 1 && data.playerO === user.user) {
        toast.warning("😭😢😢 You are lost");
      } else {
        toast("🐣🐥🐔🐓🦃 Winner Winner Chicken Dinner");
      }
    });

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

  let isPlay = true;

  if (!infBoard.playerX || !infBoard.playerO) {
    isPlay = false;
  } else {
    isPlay =
      ((infBoard.playerX === user.user && infBoard.turn === 1) ||
        (infBoard.playerO === user.user && infBoard.turn === 0)) &&
      infBoard.winner === null;
  }

  return (
    <ThemeProvider theme={themeMUI}>
      <div className="Room" style={{ backgroundColor: theme?.backgroundColor }}>
        <div className="Room__player">
          <Player infBoard={infBoard} />
        </div>
        <div className="Room__board">
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
