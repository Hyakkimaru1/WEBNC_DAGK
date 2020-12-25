import React from "react";
import "./NewMess.css";
import { Button, Avatar } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ClientChat from "./ClientChat";

function NewMess() {
  const handleClick = (e) => {
    document.getElementById("newMess__popup").style.transform = "scale(0)";
    document.getElementById("clientChat").style.display = "flex";

    document.getElementById("showguest").style.height = "26vh";
    let objDiv = document.getElementsByClassName("chatBox")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
  };

  return (
    <div className="newMess">
      <Avatar
        onClick={handleClick}
        id="newMess__popup"
        className="newMess__popup"
        src=""
      />
      <Button
        variant="contained"
        onClick={() =>{
          //
        }}
      >
        <AddIcon />
      </Button>
      <ClientChat />
    </div>
  );
}

export default NewMess;
