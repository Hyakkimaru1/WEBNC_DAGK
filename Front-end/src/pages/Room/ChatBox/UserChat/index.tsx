import React, { useContext } from "react";
import "./style.scss";
import { ThemeContext } from '@/contexts/ThemeContext';

const UserChat: React.FC<{name:string,text:string}> = ({name,text}) => {
    
  const {theme } = useContext(ThemeContext);
  return <li>
      <span style={{color:theme?.text}}>{name}</span>: <span style={{color:theme?.text}}>{text}</span>
  </li>;
};

export default UserChat;
