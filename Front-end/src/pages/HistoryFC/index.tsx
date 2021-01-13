import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { DialogTitleProps, Paper } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import "./style.scss";
import { ThemeContext } from "@/contexts/ThemeContext";
import Board from "../Room/Board";
import CardUser from "./CardUser";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";
import { UserContext } from "@/contexts/UserContext";
import History from "./History";
import { useDispatch } from "react-redux";
import { callHistoryUserSlide } from "@/actions/HistoryUserSlide";
import { toast } from "react-toastify";
import CurrentBoardPlay from "@/types/CurrentBoardPlay";
import Avatar from "@material-ui/core/Avatar";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ChatsHistory from "./ChatsHistory/index";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryFC() {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const user: any = useContext(UserContext);
  const dispatch = useDispatch();
  const [data, setData] = useState<CurrentBoardPlay[]>([]);
  const [boardShow, setBoardShow] = useState<any>(null);
  const [turn, setTurn] = useState(0);
  const [chats, setChats] = useState<any>({});
  useEffect(() => {
    const page = 1;
    dispatch(
      callHistoryUserSlide({
        page,
        cbSuccess: (data: any) => {
          setChats(data.dataChats);
          setData(data.docs);
        },
        cbError: () => {
          toast.error("Sorry,our bad");
        },
      })
    );
  }, [dispatch]);

  const handleClose = () => {
    setOpen(false);
  };

  const DialogTitle = (props: DialogTitleProps) => {
    const { children, ...other } = props;
    const { theme } = useContext(ThemeContext);
    return (
      <MuiDialogTitle disableTypography {...other}>
        <Typography variant="h6">{children}</Typography>
        <IconButton
          style={{
            position: "absolute",
            right: "2%",
            top: "2%",
            color: theme?.color,
          }}
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
    );
  };

  const handleSelected = (id: number) => {
    setBoardShow(data[id]);
    setTurn(0);
    setOpen(true);
  };

  return (
    <div className="historyfc">
      <div onClick={() => history.push(ROUTERS.HOME)} className="button-back">
        <ArrowBackIcon style={{ color: "white" }} />
      </div>
      <div className="historyfc__user">
        <CardUser user={user} />
      </div>

      <div className="historyfc__history">
        <History handleSelected={handleSelected} data={data} user={user} />
      </div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle id="customized-dialog-title">History</DialogTitle>
        <div className="historyfc__showUser">
          <Paper style={{ position: "relative" }} elevation={3}>
            <Avatar />{" "}
            <span className="historyfc__showUser--name">
              {boardShow?.playerO.name}
            </span>
            <div className="square__O"></div>
          </Paper>
          <Paper style={{ position: "relative" }} elevation={3}>
            <Avatar />{" "}
            <span className="historyfc__showUser--name">
              {boardShow?.playerX.name}
            </span>
            <div className="square__X"></div>
          </Paper>
        </div>
        <div className="historyfc__Play">
          <div className="historyfc__Play--button">
            <Button
              disabled={turn === 0 ? true : false}
              onClick={() => {
                if (turn > 0) {
                  setTurn(turn - 1);
                }
              }}
              variant="contained"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              disabled={turn === boardShow?.board.length - 1 ? true : false}
              onClick={() => {
                if (turn < boardShow.board.length - 1) {
                  setTurn(turn + 1);
                }
              }}
              variant="contained"
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <ChatsHistory chats={chats} roundId={boardShow?._id} />
        </div>

        <div className="historyfc__board">
          <Board
            board={boardShow?.board[turn]}
            isPlay={false}
            onClick={() => {}}
          />
        </div>
      </Dialog>
    </div>
  );
}
