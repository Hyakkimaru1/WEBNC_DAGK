import React, { useContext, useEffect } from "react";
import Field from "./Field";
import "./style.scss";

import { Avatar, Backdrop, CircularProgress } from "@material-ui/core";
import EmojiEventsTwoToneIcon from "@material-ui/icons/EmojiEventsTwoTone";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Snow from "./Snow";
import { useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { getAllTopRanking } from "@/actions/TopRanking";
import { toast } from "react-toastify";
import USER from "@/types/USER";

const Top: React.FC = () => {
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const listUserTop = useSelector((state: any) => state.TopRanking);
  const dispatch = useDispatch();
  // call redux get list here
  useEffect(() => {
    dispatch(
      getAllTopRanking({
        cbError: (error: any) => {
          if (error) {
            toast.error(error);
          } else toast.error("😟😟😟 Connection error");
        },
      })
    );
  }, [dispatch]);

  return (
    <div className="top-wrapper">
      <Snow />
      <div onClick={() => history.push(ROUTERS.HOME)} className="button-back">
        <ArrowBackIcon style={{ color: "white" }} />
      </div>
      <div className="top">
        <div className="top__label">
          <h1 style={{ color: theme?.color }}>Ranking</h1>
        </div>
        <div className="top__container">
          <ul className="top__table">
            <Backdrop
              style={{ backgroundColor: "rgba(255,255,255,.75", zIndex: 11111 }}
              open={listUserTop.isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            {listUserTop.data.listTops.map((ele: USER,i:number) => 
              <Field key={ele.user} top={i+1} avatar={ele.avatar} win={ele.wins} user={ele.user} point={ele.cups} />
            )}

            <li className="top__field--me">
              <div className="top__field--container">
                <div>
                  <span
                    className="top__ranking"
                    style={{ background: "#FC427B" }}
                  >
                    1
                  </span>
                </div>
                <div className="top__username">
                  <Avatar src={listUserTop.data.userRanking.avatar}/>
                  <span className="top__username--name">{listUserTop.data.userRanking.user}</span>
                </div>
                <div className="top__win">{listUserTop.data.userRanking.wins}</div>
                <div className="top__cup">
                  <EmojiEventsTwoToneIcon />
                  <span>{listUserTop.data.userRanking.cups}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Top;
