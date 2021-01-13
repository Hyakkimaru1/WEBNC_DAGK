import React, { useContext } from "react";
import "./style.scss";
import { Paper } from "@material-ui/core";
import { UserContext } from "@/contexts/UserContext";

const ChatsHistory: React.FC<{ chats?: any; roundId?: any }> = ({
  chats,
  roundId,
}) => {
  const user: any = useContext(UserContext);
  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Chat</h3>
      <Paper className="ChatsHistory--wrapper" elevation={3}>
        <div className="ChatsHistory">
          {chats[roundId] &&
            chats[roundId].map((ele: any,index:number) => {
              return ele.user !== user.user ? (
                <div key={index} className="ChatsHistory__friend">
                  <span className="ChatsHistory__friend--name">{ele.user}</span>
                  <div>
                  <p className="ChatsHistory__friend--chats">
                  {ele.message}
                  </p>
                  </div>
                </div>
              ) : (
                <div key={index} className="ChatsHistory__me">
                  <p className="ChatsHistory__me--chats">{ele.message}</p>
                </div>
              );
            })}
        </div>
      </Paper>
    </div>
  );
};

export default ChatsHistory;
