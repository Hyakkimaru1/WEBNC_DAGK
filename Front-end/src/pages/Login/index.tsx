import React from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
});

const Login: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    //console.log(email, password);
  });

  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <form onSubmit={onSubmit} action="" className="login__form">
        <h3>LOGIN FORM</h3>
        <TextField
          inputRef={register}
          name="email"
          label="Email"
          type="email"
        />
        <br />
        <TextField
          inputRef={register}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Sign in
        </Button>
        <Link to={ROUTERS.SIGNUP}>Sign up</Link>
        <br />
        <div className="login__form--button">
          <Button className="login__form--button-gg" variant="contained">
            GOOGLE
          </Button>
          <Button className="login__form--button-fb" variant="contained">
            Facebook
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
