import React from 'react';
import { Avatar } from "@material-ui/core";
import StarsIcon from "@material-ui/icons/Stars";

const Field:React.FC<{top:number,user:string,avatar:string,win:number,point:number}> = ({top,avatar,user,win,point}) => {
    return (
        <li className="top__field">
            <div>
                {
                    top===1?<span className="top__ranking top__ranking--1">{top}</span>:<span className="top__ranking">{top}</span>
                }
                </div>
            <div className="top__username">
              <Avatar src={avatar}/>
              <span  className="top__username--name">{user}</span>
            </div>
            <div className="top__win">
              {win}
            </div>
            <div className="top__cup">
              <StarsIcon />
              <span>{point}</span>
            </div>
          </li>
    );
}

export default Field;
