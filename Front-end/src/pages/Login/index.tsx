import React, { useContext } from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import {
  Button,
  createMuiTheme,
  TextField,
  ThemeProvider,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth, providerFB, providerGG } from "@/configs/firebase";
import { productAPI } from "@/configs/productAPI";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import firebase from "firebase";
import { ThemeContext } from "@/contexts/ThemeContext";
import THEME from "@/constants/Theme";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter an email"),
  password: yup.string().required("This field is required"),
});

const Login: React.FC = () => {
  const router = useHistory();
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

  const { register, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    productAPI
      .login(email, password)
      .then((result: AxiosResponse<any>) => {
        localStorage.setItem("token", result.data.token);
        router.push(ROUTERS.HOME);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.error("😢 Wrong username or password");
        }
        else {
          toast.error("😢 Wrong username or password");
        }
      });
  });

  const handleClickGG = () => {
    auth
      .signInWithPopup(providerGG)
      .then(async (result) => {
        if (result.user && result.credential) {
          const credential = result.credential as firebase.auth.OAuthCredential;
          await productAPI
            .loginGGFB(
              false,
              result.user.email,
              result.user.uid,
              result.user.photoURL,
              result.user.displayName,
              credential.idToken
            )
            .then((res: any) => {
              console.log("res", res);
              localStorage.setItem("token", res.data.token);
              router.push(ROUTERS.HOME);
            })
            .catch((err) => {
              toast.error("WRONG USERNAME OR PASSWORD");
            });
        }
      })
      .catch((error) => {});
  };

  const handleClickFB = () => {
    auth
      .signInWithPopup(providerFB)
      .then(async (result) => {
        if (result.user && result.credential) {
          const credential = result.credential as firebase.auth.OAuthCredential;
          await productAPI
            .loginGGFB(
              true,
              result.user.email,
              result.user.uid,
              result.user.photoURL,
              result.user.displayName,
              credential.accessToken
            )
            .then((res: any) => {
              localStorage.setItem("token", res.data.token);
              router.push(ROUTERS.HOME);
            })
            .catch((err) => {
              toast.error("WRONG USERNAME OR PASSWORD");
            });
        }
      })
      .catch(async (error) => {
        if (error.email) {
          toast.error(
            "This email is using in other google account or facebook account in this"
          );
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="login__wrapper" style={{ backgroundImage: `url(${BG})` }}>
      <form
        onSubmit={onSubmit}
        action=""
        className="login__form"
        style={{ backgroundColor: theme?.formBackGround }}
      >
        <h3 style={{ color: theme?.color }}>LOGIN FORM</h3>
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
            color="secondary"
          />
          <br />
          <Button type="submit" variant="contained" color="primary">
            Sign in
          </Button>
          <Link to={ROUTERS.SIGNUP}>Sign up</Link>
          <br />
          <div className="login__form--button">
            <Button
              onClick={handleClickGG}
              className="login__form--button-gg"
              variant="contained"
            >
              GOOGLE
            </Button>
            <Button
              onClick={handleClickFB}
              className="login__form--button-fb"
              variant="contained"
            >
              Facebook
            </Button>
          </div>
        </ThemeProvider>
      </form>
    </div>
  );
};

export default Login;
