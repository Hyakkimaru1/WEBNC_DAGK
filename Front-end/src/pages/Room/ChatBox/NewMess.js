import React from "react";
import "./NewMess.css";
import EditIcon from "@material-ui/icons/Edit";
import { Button, Avatar } from "@material-ui/core";
import ClientChat from "./ClientChat";

function NewMess() {
  const handleClick = (e) => {
    document.getElementById("newMess__popup").style.transform = "scale(0)";
    document.getElementById("clientChat").style.display = "flex";
    let objDiv = document.getElementsByClassName("chatBox")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  return (
    <div className="newMess">
      <Avatar
        onClick={handleClick}
        id="newMess__popup"
        className="newMess__popup"
        src="https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-0/p320x320/118421125_950586378741587_120312778914174260_n.jpg?_nc_cat=106&_nc_sid=825194&_nc_ohc=3RANRYXezZMAX-ct83R&_nc_ht=scontent.fdad1-1.fna&tp=6&oh=65a20ff39d01281ad908c95fcdd919d0&oe=5F7144B3"
      />
      <Button
        onClick={() =>
          (document.getElementById("newMess__popup").style.transform =
            "scale(1)")
        }
      >
        <EditIcon />
      </Button>
      <ClientChat />
    </div>
  );
}

export default NewMess;
