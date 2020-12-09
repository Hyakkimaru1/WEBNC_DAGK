import React, { useState } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, Snackbar, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormDataSignUp } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert } from "@material-ui/lab"
import { error } from "console";
import { productAPI } from "@/configs/productAPI";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
  confirmPassword: yup.string().required("This field is required"),
});

const Signup: React.FC<{}> = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit,errors } = useForm<FormDataSignUp>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ email, password, confirmPassword }) => {
    if (password !== confirmPassword)
    {
      setOpen(true);
    }
    else productAPI
      .signUp(email, password)
      .then((result: AxiosResponse<any>) => {
        toast.success("Register succeeded!");
      })
      .catch((err) => {
        if (err.response.status !== 201) {
          toast.error("Can not register!");
        } 
      });
  });
  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}>
        <Alert severity="warning"> Password and confirm password must be equal! </Alert>
      </Snackbar>
      <form onSubmit={onSubmit} action="" className="login__form">
        <h3>SIGN UP FORM</h3>
        <TextField
          inputRef={register}
          name="email"
          label="Email"
          type="email"
        />
        {errors.email?<span style={{color:'red',fontSize:'.6rem'}}>{errors.email.message}</span>:<br />}
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
