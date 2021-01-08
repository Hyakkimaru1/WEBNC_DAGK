import React, { useRef, useContext, useEffect,useState } from "react";
import moment from "moment";
// import { toast } from "react-toastify";
// import { UserContext } from "@/contexts/UserContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { UserContext } from "@/contexts/UserContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import CheckRankUser from "@/Function/CheckRankUser";
import ColorizeIcon from "@material-ui/icons/Colorize";
import { UserForm } from "@/types/FormData";
import { useDispatch, useSelector } from "react-redux";
import { callUserProfile } from "@/actions/UserProfile";
import { Button } from "@material-ui/core";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { callUpdateUserProfile } from "@/actions/UpdateUserProfile";

const schema = yup.object().shape({
  name: yup.string().required("This field is required"),
});

const Showrooms: React.FC = () => {
  //const user = useContext(UserContext);
  //const [user, setUser] = useState();

  const { theme } = useContext(ThemeContext);
  const userContext: any = useContext(UserContext);
  const avatarRef = useRef(null);
  const [nameValue,setNameValue] = useState("");
  const imgAvatarRef = useRef(null);

  const { register, handleSubmit } = useForm<UserForm>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: any) => state.UserProfile);
  const state = useSelector((state: any) => state.UpdateUserProfile);

  useEffect(() => {
    dispatch(
      callUserProfile({
        _id: userContext._id,
        cbSuccess: (data: any) => {},
        cbError: () => {},
      })
    );
  }, [dispatch, userContext._id]);

  useEffect(()=>{
    setNameValue(user.name);
  },[user]);
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

  const onSubmit = handleSubmit(({ name }) => {
    if (name.trim() !== "") {
      dispatch(
        callUpdateUserProfile({
          name,
          cbSuccess: () => {
            toast.success("️🎉️🎉️🎉 Updated");
          },
          cbError: () => toast.error("🐼 update fail"),
        })
      );
    }
  });

  return (
    <div className="Showroom">
      <Loading isLoading={isLoading || state.isLoading} />
      <div className="Showroom__avt">
        <div className="Showroom__img">
          <img
            className="Showroom__img--img"
            alt=""
            src={user?.avatar}
            ref={imgAvatarRef}
          />
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
      <br />
      <div className="Showroom__base">
        <div className="Showroom__base--field">
          <AcUnitIcon style={{ marginRight: 10, color: "#D980FA" }} /> Rank :
          &nbsp;
          <p className="Showroom__base--strong">{CheckRankUser(user?.cups)}</p>
        </div>
        <div className="Showroom__base--field">
          <ColorizeIcon style={{ marginRight: 10, color: "#FDA7DF" }} /> Win :
          &nbsp;<p className="Showroom__base--strong">{user?.wins}</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="Showroom__info">
        <label htmlFor="inputName" className="Showroom__info--label">
          Tên
        </label>
        <input
          type="text"
          ref={register}
          value={nameValue}
          name="name"
          onChange={(e)=>setNameValue(e.target.value)}
          className="Showroom__info--input"
          required
          style={{ color: theme?.color }}
        ></input>

        <label htmlFor="inputEmail" className="Showroom__info--label">
          Email
        </label>
        <input
          readOnly={true}
          value={user?.user}
          type="email"
          className="Showroom__info--input Showroom__info--email"
          style={{ color: theme?.color }}
        ></input>

        <label htmlFor="inputBirthday" className="Showroom__info--label">
          Ngày tham gia
        </label>
        <input
          type="date"
          name="joindate"
          value={moment(user?.joinDate).format("YYYY-MM-DD")}
          readOnly={true}
          style={{ color: theme?.color }}
          className="Showroom__info--input Showroom__info--email"
        ></input>
        <div>
          <Button
            variant="contained"
            type="submit"
            style={{ marginTop: "1rem" }}
            color="primary"
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Showrooms;
