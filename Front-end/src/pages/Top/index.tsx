import React from "react";
import Field from "./Field";
import "./style.scss";

import { Avatar } from "@material-ui/core";
import StarsIcon from "@material-ui/icons/Stars";

const Top: React.FC = () => {
  return (
    <div className="top">
      <div><h3>Raking</h3></div>
      <div>
        <ul className="top__table">
          <Field top={1} avatar="" win={999} user="Duy" point={999}/>
          <Field top={2} avatar="" win={999} user="Duy" point={999}/>
          <Field top={3} avatar="" win={999} user="Duy" point={999}/>
          <Field top={4} avatar="" win={999} user="Duy" point={999}/>
          <Field top={5} avatar="" win={999} user="Duy" point={999}/>
          <Field top={6} avatar="" win={999} user="Duy" point={999}/>
          <Field top={7} avatar="" win={999} user="Duy" point={999}/>
          <Field top={8} avatar="" win={999} user="Duy" point={999}/>
         <li className="top__field--me">
            <div className="top__field--container">
                <div><span className="top__ranking">1</span></div>
                <div className="top__username">
                <Avatar />
                <span  className="top__username--name">Duy Duy</span>
                </div>
                <div className="top__win">
                999
                </div>
                <div className="top__cup">
                <StarsIcon />
                <span>999</span>
                </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Top;
