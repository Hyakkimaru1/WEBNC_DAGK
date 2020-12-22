import React, { useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from '@/contexts/ThemeContext';

const ChangePass: React.FC = () => {
  //use react-hook-form here
  const { theme } = useContext(ThemeContext);
  const handleClick = () => {
    toast.error("Điền đủ mật khẩu và xác nhận lại");
  };
  return (
    <div className="ChangePass">
      <form style={{ marginTop: "2.4rem" }}>
        <div className="ChangePass__group">
          <input
            id="changepass_old"
            type="password"
            className="ChangePass__input"
            placeholder="Mật khẩu hiện tại"
            name="username"
            style={{color:theme?.color}}
            required
          />
          <label  style={{color:theme?.color}} htmlFor="changepass_old" className="ChangePass__label">
            Mật khẩu hiện tại
          </label>
          <span
            style={{ color: "red" }}
            id="showFail"
            className="ChangePass__error"
          ></span>
        </div>
        <div className="ChangePass__group">
          <input
            id="changepass_new"
            type="password"
            className="ChangePass__input"
            placeholder="Mật khẩu mới"
            name="username"
            style={{color:theme?.color}}
            required
          />
          <label style={{color:theme?.color}} htmlFor="changepass_new" className="ChangePass__label">
            Mật khẩu mới
          </label>
          <span
            style={{ color: "red" }}
            id="showFail"
            className="ChangePass__error"
          ></span>
        </div>
        <div className="ChangePass__group">
          <input
            id="changepass_confirm"
            type="password"
            className="ChangePass__input"
            placeholder="Xác nhận mật khẩu mới"
            name="username"
            style={{color:theme?.color}}
            required
          />
          <label style={{color:theme?.color}} htmlFor="changepass_confirm" className="ChangePass__label">
            Xác nhận mật khẩu mới
          </label>
          <span
            style={{ color: "red" }}
            id="showFail"
            className="ChangePass__error"
          ></span>
        </div>
        <div onClick={handleClick} className="bt__default">
          Cập nhật
        </div>
      </form>
    </div>
  );
};

export default ChangePass;
