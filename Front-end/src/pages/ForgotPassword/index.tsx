import React, { useContext } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormForgotPassword } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { callForgotPassword } from "@/actions/ForgotPassword";
import Loading from "@/components/Loading";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
});

const ForgotPassword: React.FC = () => {
  const history = useHistory();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const {isLoading} = useSelector((state:any) => state.ForgotPassword);

  const { register, handleSubmit } = useForm<FormForgotPassword>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ email }) => {
    dispatch(callForgotPassword({email,cbSuccess:()=>{
      toast.success("Check out your email to reset password!");
      history.push(ROUTERS.LOGIN);
    }, cbError: () => {
      toast.error("That address is not a verified primary email or is not associated with a personal user account.")
    }}));
  });


  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <Loading isLoading={isLoading}/>
      <form
        onSubmit={onSubmit}
        action=""
        className="login__form"
        style={{ backgroundColor: theme?.formBackGround }}
      >
        <h3 style={{ color: theme?.color }}>FORGOT PASSWORD</h3>
        <TextField
          inputRef={register}
          name="email"
          label="Email"
          type="email"
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Confirm
        </Button>
        <div>
        <Link to={ROUTERS.SIGNUP}>Sign in?</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={ROUTERS.SIGNUP}>Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
