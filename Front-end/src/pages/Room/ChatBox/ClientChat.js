import { Avatar } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CallIcon from "@material-ui/icons/Call";
import CloseIcon from "@material-ui/icons/Close";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EmojiEmotionsSharpIcon from "@material-ui/icons/EmojiEmotionsSharp";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import GifIcon from "@material-ui/icons/Gif";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import RemoveIcon from "@material-ui/icons/Remove";
import ThumbUpAltSharpIcon from "@material-ui/icons/ThumbUpAltSharp";
import VideocamIcon from "@material-ui/icons/Videocam";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import socket from "@/configs/socket";
import ChatBox from "./ChatBox";
import "./ClientChat.css";

function ClientChat() {
  const params = useParams();
  const token = localStorage.getItem("token");
  const [input, setInput] = useState();
  const [message,setmessage] = useState('');
  const id = params.id;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit("sendMess", { roomId: id, token, message: input }, () =>
        setInput("")
      );
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setmessage(e.target.value);
    if (value === "" || !value) {
      //document.getElementsByClassName('clientChat__textbox')[0].style.width='';
      requestAnimationFrame(() => {
        document.getElementById("chatMess").style.width = "100px";
        document.getElementById("photoIcon").style.width = "";
        document.getElementById("dashIcon").style.width = "";
        document.getElementById("gifIcon").style.width = "";
      }, 270);
    } else {
      requestAnimationFrame(() => {
        document.getElementById("photoIcon").style.width = "0px";
        document.getElementById("dashIcon").style.width = "0px";
        document.getElementById("gifIcon").style.width = "0px";
        document.getElementById("chatMess").style.width = "190px";
        //document.getElementsByClassName('clientChat__textbox')[0].style.width='70%';
      }, 270);
    }
  };

  return (
    <div className="clientChat" id="clientChat">
      <div className="clientChat__top">
        <div className="clientChat__info">
          <div className="clientChat__info--avt">
            <Avatar
              className="newMess__popup"
              src="https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-0/p320x320/118421125_950586378741587_120312778914174260_n.jpg?_nc_cat=106&_nc_sid=825194&_nc_ohc=3RANRYXezZMAX-ct83R&_nc_ht=scontent.fdad1-1.fna&tp=6&oh=65a20ff39d01281ad908c95fcdd919d0&oe=5F7144B3"
            />
          </div>
          <div className="clientChat__info--name">
            <div className="clientChat__name">
              <p>Group</p> <ExpandMoreIcon />
            </div>
            <p>Active now</p>
          </div>
        </div>
        <div className="clientChat__button">
          <VideocamIcon />
          <CallIcon />
          <RemoveIcon
            onClick={() => {
              document.getElementById("clientChat").style.display = "none";
              document.getElementById("newMess__popup").style.transform =
                "scale(1)";
              document.getElementById("showguest").style.height="80vh";
            }}
          />
          <CloseIcon
            onClick={() => {
              document.getElementById("clientChat").style.display = "none";
              document.getElementById("showguest").style.height="80vh";
            }}
          />
        </div>
      </div>
      <div className="clientChat__body">
        <ChatBox />
      </div>
      <div className="clientChat__bottom">
        <AddCircleIcon id="addCirIcon" />
        <PhotoLibraryIcon id="photoIcon" />
        <DashboardIcon id="dashIcon" />
        <GifIcon id="gifIcon" />
        <div className="clientChat__textbox">
          <form className="clientChat__input">
            <input
              value={message}
              type="text"
              placeholder="Aa"
              onChange={handleChange}
              id="chatMess"
            />
            <EmojiEmotionsSharpIcon />
            <button
              onClick={handleSubmit}
              style={{ display: "none" }}
              type="submit"
            ></button>
          </form>
        </div>
        <ThumbUpAltSharpIcon
          style={{ position: "absolute", top: "14px", right: "5px" }}
        />
      </div>
    </div>
  );
}

export default ClientChat;
