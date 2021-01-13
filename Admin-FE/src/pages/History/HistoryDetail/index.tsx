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
  Button
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import "./styles.scss";
import ModeCommentIcon from "@material-ui/icons/ModeComment";
import { toast } from "react-toastify";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
  const [messages, setMessages] = useState([]);
  const history = useHistory();
  useEffect(() => {
    dispatch(
      callGetHistoryDetail({
        id,
        cbSuccess: (data: any) => {
          if (data){
            setMessages(data);
          }
        },
        cbError: () => {
          toast.error("Load history detail failed");
        },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="chat">
      <Button onClick={()=>history.goBack()} className="button-back">
        <ArrowBackIcon/>
      </Button>
      <div>
        <h2 className="chat__header">Chat of game: {id}</h2>
      </div>
      <div className="chat__list">
        {
          messages.length>0?(<List component="nav" className={classes.root}>
          {messages.map((chat: any,index:number) => (
            <ListItem button key={index}>
              <ListItemAvatar>
                <Avatar>
                  <ModeCommentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText> {chat.user} </ListItemText>
              <ListItemText> {chat.message} </ListItemText>
            </ListItem>
          ))}
        </List>):<h2 style={{textAlign:"center"}}>THIS GAME HAS NO CHAT</h2>
        }
      </div>
    </div>
  );
};

export default HistoryDetail;
