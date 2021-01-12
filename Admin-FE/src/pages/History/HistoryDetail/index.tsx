import { callGetHistoryDetail } from "@/actions/GetHistoryDetail";
import {
  Avatar,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./styles.scss";
import ModeCommentIcon from "@material-ui/icons/ModeComment";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 1000,
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
    },
  })
);
const HistoryDetail = () => {
  const classes = useStyles();
  const params: any = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const [data, setMessages] = useState([]);
  useEffect(() => {
    dispatch(
      callGetHistoryDetail({
        id,
        cbSuccess: (data: any) => {
          setMessages(data);
          console.log(data);
        },
        cbError: () => {
          toast.error("Load history detail failed");
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const messages: any = data;
  return (
    <div className="chat">
      <div>
        <h2 className="chat__header">Chat of game: {id}</h2>
      </div>
      <div className="chat__list">
        <List component="nav" className={classes.root}>
          {messages.map((chat: any) => (
            <ListItem button key={chat.id}>
              <ListItemAvatar>
                <Avatar>
                  <ModeCommentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText> {chat.user} </ListItemText>
              <ListItemText> {chat.message} </ListItemText>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default HistoryDetail;
