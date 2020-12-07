import React, { useState, useContext } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, createMuiTheme, Snackbar, TextField, ThemeProvider } from "@material-ui/core";
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
import THEME from '@/constants/Theme';

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
  confirmPassword: yup.string().required("This field is required"),
});

const Signup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<FormDataSignUp>({
    resolver: yupResolver(schema),
  });
  const { userTheme, theme } = useContext(ThemeContext);

  const themeMUI = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: userTheme === THEME.LIGHT ? "light" : "dark",
        },
      }),
    [userTheme]
  );
  const onSubmit = handleSubmit(({ email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setOpen(true);
    } else {
      productAPI
        .register(email, password)
        .then(() => {
          toast.success("😋 success");
        })
        .catch((err) => {
          console.log(err);
          toast.error("😭 This email is used");
        });
    }
  });
  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
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
        <ThemeProvider theme={themeMUI}>
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
        </ThemeProvider>
      </form>
    </div>
  );
};

export default Signup;
