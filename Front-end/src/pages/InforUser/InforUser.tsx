import React, { useState, useContext } from "react";
import ListOptions from "./ListOptions";
import Showrooms from "./Showrooms/Showrooms";
import ChangePass from "./ChangePass/ChangePass";
//import { toast } from "react-toastify";
import "./style.scss";
import { UserContext } from "@/contexts/UserContext";
import { ThemeContext } from '@/contexts/ThemeContext';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ROUTERS from '@/constants/routers';
import { useHistory } from 'react-router-dom';


const InforUser: React.FC = () => {
  const [option, setOption] = useState("ListOption1");
  const user: any = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const history = useHistory();

  const changeOption = (newOption: string) => {
    setOption(newOption);
  };
  const bodyShowroom =
    option === "ListOption1" ? <Showrooms /> : <ChangePass />;
  const info =
    option === "ListOption1"
      ? {
          name: "Thông tin tài khoản",
          info: "Cá nhân hóa tài khoản bằng việc cập nhật thông tin của bạn",
        }
      : {
          name: "Thay đổi mật khẩu",
          info:
            "Đổi mật khẩu ít nhất 6 tháng 1 lần để bảo vệ tài khoản của bạn",
        };
  return (
    <div className="Box" style={{ backgroundColor: theme?.backgroundColor }}>
      <div onClick={() => history.push(ROUTERS.HOME)} style={{top:"2%",left:"2%"}} className="button-back">
        <ArrowBackIcon style={{ color: "white" }} />
      </div>
      <div className="row">
        <div className="col-3-of-4">
          <div className="BoxStart">
            <div className="BoxStart__img">
              <img className="BoxStart__img--img" src={user?.avatar} alt="" />
            </div>
            <div className="BoxStart__name">
              <div className="BoxStart__name--name">{user.user}</div>
              <div style={{ color: theme?.color }} className="BoxStart__name--inf">
                &nbsp;&nbsp;&nbsp; {info.name}
              </div>
              <div className="BoxStart__name--comment">
                <p>{info.info}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: "-4rem" }}>
        <div className="col-1-of-3">
          <ListOptions onClick={changeOption} option={option} />
        </div>
        <div className="col-2-of-3">{bodyShowroom}</div>
      </div>
    </div>
  );
};

export default InforUser;
