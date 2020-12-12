import React from "react";
import "./style.scss";
import { Grid, TextField, Button } from "@material-ui/core";
import {} from "@material-ui/core";

const ChatBox: React.FC = () => {
  return (
    <div className="chatbox">
      <div className="chatbox__container">
        <ul className="chatbox__chats"></ul>
        <div className="chatbox__inputchat">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary">
                Primary
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
