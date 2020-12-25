import React, { useContext } from "react";
import "./style.scss";

import WhatshotIcon from "@material-ui/icons/Whatshot";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useHistory } from 'react-router-dom';
import ROUTERS from '@/constants/routers';

const UserTop: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const history = useHistory();
  return (
    <div onClick={()=>{
      history.push(ROUTERS.TOP);
    }} style={{background: theme?.BackgrounImg,
        backgroundBlendMode: theme?.backgroundBlendMode}} className="UserTop">
      <WhatshotIcon style={{ fontSize: "3rem", color: 'red' }} />
      <p style={{color:theme?.color}}>Top</p>
    </div>
  );
};

export default UserTop;
