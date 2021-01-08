import React, { useState, useContext } from "react";
import "./style.scss";
import { Button, CircularProgress, Snackbar, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormDataSignUp } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "@material-ui/lab";
import * as yup from "yup";
import { productAPI } from "@/configs/productAPI";
import { toast } from "react-toastify";
import { ThemeContext } from '@/contexts/ThemeContext';

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
  name: yup
      .string()
      .required("This field is required"),
  confirmPassword: yup.string().required("This field is required"),
});

const SignupForm: React.FC<{handleConfirm:(data:any)=>void}> = ({handleConfirm}) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<FormDataSignUp>({
    resolver: yupResolver(schema),
  });
  const { theme } = useContext(ThemeContext);
  const [loading,setLoading] = useState(false);

  const onSubmit = handleSubmit(({ email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setOpen(true);
    } else {
      setLoading(true);
      productAPI
        .register(email, password)
        .then((data) => {
          setLoading(false);
          handleConfirm(data.data);
        })
        .catch((err) => {
          setLoading(false);
          toast.error("😭 This email is used");
        });
    }
  });
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Alert severity="warning">
          Password and confirm password must be equal!
        </Alert>
      </Snackbar>
      <form onSubmit={onSubmit} action="" className="login__form" style={{ backgroundColor: theme?.formBackGround }}>
        <h3 style={{ color: theme?.color }}>SIGN UP FORM</h3>
        <TextField
          inputRef={register}
          name="name"
          label="Name"
          required
          type="text"
        />
        <br />
        <TextField
          inputRef={register}
          name="email"
          label="Email"
          required
          type="email"
        />
        <br />
        <TextField
          inputRef={register}
          name="password"
          label="Password"
          type="password"
          required
          autoComplete="current-password"
        />
        <br />
        <TextField
          inputRef={register}
          name="confirmPassword"
          label="Confirm Password"
          required
          type="password"
        />
        <br />
        <div className="SignUpForm__button">
        <Button disabled={loading} type="submit" variant="contained" color="primary">
          Sign up
        </Button>
        {loading && <CircularProgress size={24} className="SignUpForm__process" />}
        </div>
        <Link to={ROUTERS.LOGIN}>Sign in</Link>
      </form>
    </>
  );
};

export default SignupForm;
