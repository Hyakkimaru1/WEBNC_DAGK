import React, { useContext } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, TextField } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormResetPassword } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { callResetPassword } from "@/actions/ResetPassword";

const schema = yup.object().shape({
  password: yup.string().required("This field is required"),
  confirmpassword: yup.string().required("This field is required"),
});

const ResetPassword: React.FC = () => {
  const params:any = useParams();
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: any) => state.ForgotPassword);

  const { register, handleSubmit } = useForm<FormResetPassword>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ password, confirmpassword }) => {
    if (password !== confirmpassword) {
      toast.error("Password must equal Confirm password");
    } else {
      const paramsSend = { params: params.token, password };
      dispatch(
        callResetPassword({
          paramsSend,
          cbSuccess: () => {
            toast.success("Change password success");
            history.push(ROUTERS.LOGIN);
          },
          cbError: () => {
            toast.error("Something is wrong!!");
          },
        })
      );
    }
  });

  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <Loading isLoading={isLoading} />
      <form
        onSubmit={onSubmit}
        action=""
        className="login__form"
        style={{ backgroundColor: theme?.formBackGround }}
      >
        <h3 style={{ color: theme?.color }}>RESET PASSWORD</h3>
        <TextField
          inputRef={register}
          name="password"
          label="Password"
          type="password"
        />
        <br />
        <TextField
          inputRef={register}
          name="confirmpassword"
          label="Cofirm password"
          type="password"
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Confirm
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
