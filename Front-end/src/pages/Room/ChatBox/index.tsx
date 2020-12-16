import React, { useContext } from "react";
import "./style.scss";
import UserChat from "./UserChat/index";
import NewMess from "./NewMess";
import { ThemeContext } from "@/contexts/ThemeContext";

const ChatBox: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div>
      <NewMess />
      <div className="chatbox">
        <ul id="showguest" className="chatbox__chats">
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>

          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
          <UserChat name="duy" theme={theme}/>
        </ul>
      </div>
    </div>
  );
};

export default ChatBox;
