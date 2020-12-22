import React, { useRef, useContext } from "react";
//import moment from "moment";
// import { toast } from "react-toastify";
// import { UserContext } from "@/contexts/UserContext";
import { ThemeContext } from "@/contexts/ThemeContext";

const Showrooms: React.FC = () => {
  //const user = useContext(UserContext);
  //const [user, setUser] = useState();

  const { theme } = useContext(ThemeContext);
  const avatarRef = useRef(null);
  const imgAvatarRef = useRef(null);

  const openFile = function (event: any) {
    const input = event.target;

    const reader = new FileReader();
    reader.onload = function () {
      const dataURL = reader.result;
      const output: any = imgAvatarRef.current;
      if (output) {
        output.src = dataURL;
      }
    };
    reader.readAsDataURL(input.files[0]);
  };

  const handleOnClick = () => {
    // let userUpdate = { ...this.state.user };
    // delete userUpdate.admin;
    // delete userUpdate.type;
    // delete userUpdate.user;
    // delete userUpdate.avt;
    // if (document.getElementById("inputBirthday").value !== null) {
    //   userUpdate.ngaysinh = moment(
    //     document.getElementById("inputBirthday").value
    //   ).format("YYYY-MM-DD");
    // } else {
    //   delete userUpdate.ngaysinh;
    // }
    // if (document.getElementById("male").checked === true) {
    //   userUpdate.gioitinh = 1;
    // } else if (document.getElementById("female").checked === true) {
    //   userUpdate.gioitinh = 2;
    // } else if (document.getElementById("another").checked === true) {
    //   userUpdate.gioitinh = 3;
    // }
    // const instance = this;
    // if (document.getElementById("avtchanging").value !== "") {
    //   var formData = new FormData();
    //   formData.append("file", document.getElementById("avtchanging").files[0]);
    //   userUpdate.formData = formData;
    // }
    // instance.props.onClick();
  };

  return (
    <div className="Showroom">
      <div className="Showroom__avt">
        <div className="Showroom__img">
          <img className="Showroom__img--img" alt="" ref={imgAvatarRef} />
        </div>
        <div className="Showroom__avt--bt">
          <button
            style={{ marginLeft: "2rem" }}
            className="bt__default"
            onClick={() => {
              const refavt: any = avatarRef.current;
              if (refavt) {
                refavt.click();
              }
            }}
          >
            Đổi ảnh đại diện
          </button>
          <input
            style={{ display: "none" }}
            type="file"
            ref={avatarRef}
            onChange={openFile}
            accept="image/x-png,image/gif,image/jpeg"
            id="avtchanging"
          ></input>
        </div>
      </div>
      <div className="Showroom__info">
        <label htmlFor="inputName" className="Showroom__info--label">
          Tên
        </label>
        <input
          type="text"
          id="inputName"
          className="Showroom__info--input"
          required
          style={{color:theme?.color}}
        ></input>

        <label htmlFor="inputEmail" className="Showroom__info--label">
          Email
        </label>
        <input
          readOnly={true}
          id="inputEmail"
          type="email"
          className="Showroom__info--input Showroom__info--email"
          style={{color:theme?.color}}
        ></input>

        <label htmlFor="inputPhone" className="Showroom__info--label">
          Số điện thoại
        </label>
        <input
          type="number"
          min="0"
          id="inputPhone"
          className="Showroom__info--input"
          style={{color:theme?.color}}
          required
        ></input>

        <label htmlFor="inputAddress" className="Showroom__info--label">
          Địa chỉ
        </label>
        <input
          type="text"
          id="inputAddress"
          className="Showroom__info--input"
          style={{color:theme?.color}}
        ></input>

        <label htmlFor="inputBirthday" className="Showroom__info--label">
          Ngày sinh
        </label>
        <input
          type="date"
          id="inputBirthday"
          //   value={
          //     //moment(user.ngaysinh).format("YYYY-MM-DD")
          //   }
          style={{color:theme?.color}}
          className="Showroom__info--input "
        ></input>
        <label htmlFor="inputSex" className="Showroom__info--label">
          Giới tính
        </label>
        <div className="form">
          <div className="form__radio-group">
            <input
              type="radio"
              className="form__radio-input"
              id="male"
              name="gender"
            />
            <label style={{color:theme?.color}} htmlFor="male" className="form__radio-label">
              <span className="form__radio-button"></span>
              Nam
            </label>
          </div>
          <div className="form__radio-group">
            <input
              type="radio"
              className="form__radio-input"
              id="female"
              name="gender"
            />
            <label style={{color:theme?.color}} htmlFor="female" className="form__radio-label">
              <span className="form__radio-button"></span>
              Nữ
            </label>
          </div>
          <div className="form__radio-group">
            <input
              type="radio"
              className="form__radio-input"
              id="another"
              name="gender"
            />
            <label style={{color:theme?.color}} htmlFor="another" className="form__radio-label">
              <span className="form__radio-button"></span>
              Khác
            </label>
          </div>
        </div>

        <label htmlFor="inputSelf" className="Showroom__info--label">
          Giới thiệu bản thân
        </label>
        <textarea style={{color:theme?.color}} id="inputSelf" className="Showroom__info--input"></textarea>
        <div>
          <button
            onClick={handleOnClick}
            className="bt__default"
            style={{ marginTop: "4rem" }}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

export default Showrooms;
