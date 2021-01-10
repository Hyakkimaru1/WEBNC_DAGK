import React, { useContext } from 'react';
import { Avatar } from "@material-ui/core";
import { ThemeContext } from '@/contexts/ThemeContext';
import EmojiEventsTwoToneIcon from '@material-ui/icons/EmojiEventsTwoTone';

const Field:React.FC<{top:number,user:string,avatar:string,win?:number,point?:number}> = ({top,avatar,user,win,point}) => {
  const {theme} = useContext(ThemeContext);
  return (
        <li className="top__field">
            <div>
                {
                    top===1?<span className="top__ranking top__ranking--1">{top}</span>:<span className="top__ranking">{top}</span>
                }
                </div>
            <div className="top__username">
              <Avatar src={avatar}/>
              <span style={{color:theme?.color}} className="top__username--name">{user}</span>
            </div>
            <div style={{color:theme?.color}} className="top__win">
              {win}
            </div>
            <div style={{color:theme?.color}} className="top__cup">
              <EmojiEventsTwoToneIcon style={{color:"#f9ca24"}}/>
              <span>{point}</span>
            </div>
          </li>
    );
}

export default Field;
