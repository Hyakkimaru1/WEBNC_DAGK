import React from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormDataSignUp } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
  confirmPassword: yup.string().required("This field is required"),
});

const Signup: React.FC<{}> = () => {
  const { register, handleSubmit } = useForm<FormDataSignUp>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ email, password,confirmPassword}) => {
    console.log(email, password);
  });
  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <form onSubmit={onSubmit} action="" className="login__form">
        <h3>SIGN UP FORM</h3>
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
        <TextField
          inputRef={register}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Sign up
        </Button>
        <Link to={ROUTERS.LOGIN}>Sign in</Link>
      </form>
    </div>
  );
};

export default Signup;
