import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import ChatBox from "./ChatBox";
import Board from "./Board";
import Player from "./Player";
import socket from "@/configs/socket";
import { useParams } from "react-router-dom";
import CurrentBoardPlay from "@/types/CurrentBoardPlay";
import { UserContext } from "@/contexts/UserContext";
import { createMuiTheme ,ThemeProvider} from "@material-ui/core";
import THEME from "@/constants/Theme";

const Room: React.FC = () => {
  //const params = useParams();
  const { userTheme, theme } = useContext(ThemeContext);
  const user: any = useContext(UserContext);
  const params: any = useParams();
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

  useEffect(() => {
    async function emitTokenOnBoard() {
      const token = (await localStorage.getItem("token")) || "";
      socket.emit("onboard", { boardID: params.id, token });
    }
    emitTokenOnBoard();
  }, [params.id]);
  socket.on("getInfBoard", (data: any) => {
    setInfBoard(data);
  });

  const handleClickBoard = (i: number) => {
    if (infBoard.board) {
      const clone = { ...infBoard };
      clone.board[i] = clone.turn || 0;
      socket.emit("onplay", { infBoard, token });
    }
  };
  const isPlay =
    (infBoard.playerX === user.user && infBoard.turn === 1) ||
    (infBoard.playerO === user.user && infBoard.turn === 0);
  return (
    <ThemeProvider theme={themeMUI}>
      <div className="Room" style={{ backgroundColor: theme?.backgroundColor }}>
        <div className="Room__chat">
          <ChatBox />
        </div>
        <div className="Room__board">
          <Board
            isPlay={isPlay}
            board={infBoard.board}
            onClick={handleClickBoard}
          />
        </div>
        <div className="Room__player">
          <Player />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Room;
