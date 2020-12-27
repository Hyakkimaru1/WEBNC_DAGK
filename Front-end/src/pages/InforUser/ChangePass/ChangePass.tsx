import React, { useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from "@/contexts/UserContext";
import { useDispatch } from "react-redux";
import { callChangePassword } from "@/actions/ChangePassword";
import { useForm } from "react-hook-form";

const ChangePass: React.FC = () => {
  //use react-hook-form here
  const {register, handleSubmit, reset } = useForm();
  const onSubmit = (register:any) => {
    if (register.newPassword !== register.newPasswordConfirm) {
     toast.error("Mật khẩu mới và xác nhận mật khẩu mới không giống nhau!");
    } 
    else if (register.newPassword === register.password) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
    }
    else if (register.newPassword === "") {
      toast.error("Mật khẩu mới không được trống!");
    }
    else{
      changePassword(register.password, register.newPassword);
      reset({newPassword:"",password:"",newPasswordConfirm:""});
    }
  }
  const { theme } = useContext(ThemeContext);
  const user: any = useContext(UserContext);
  const dispatch = useDispatch();
  const changePassword = (password:string, newPassword:string) => {
    const username = user.user;
    dispatch(
      callChangePassword({
       username,
       password,
       newPassword,
        cbSuccess: () => {
          toast.success("Mật khẩu đã được thay đổi!");
        },
        cbError: () => {
          toast.error("Điền đủ mật khẩu và xác nhận lại!");
        },
      })
    );
    
  };
  return (
    <div className="ChangePass">
      <form style={{ marginTop: "2.4rem" }} onSubmit={handleSubmit(onSubmit)}>
        <div className="ChangePass__group">
          <input
            id="changepass_old"
            type="password"
            className="ChangePass__input"
            placeholder="Mật khẩu hiện tại"
            name="password"
            style={{color:theme?.color}}
            required
            ref = {register}
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
            name="newPassword"
            style={{color:theme?.color}}
            required
            ref = {register}
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
            name="newPasswordConfirm"
            style={{color:theme?.color}}
            required
            ref = {register}
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
        <button onClick={handleSubmit(onSubmit)} className="bt__default">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default ChangePass;
