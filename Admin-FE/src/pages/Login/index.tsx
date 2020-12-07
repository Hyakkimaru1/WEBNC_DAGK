import React from "react";
import "./style.scss";
import BG from "@/Images/2021.jpg";
import { Button, TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ROUTERS from "@/constants/routers/index";
import { useForm } from "react-hook-form";
import { FormData } from "@/types/FormData";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth, providerGG, providerFB } from "@/configs/firebase";
import { productAPI } from "@/configs/productAPI";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import firebase from "firebase";

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
    productAPI
      .login(email, password)
      .then((result: AxiosResponse<any>) => {})
      .catch((err) => {
        console.log(err.response.status);
        if (err.response.status === 404) {
          toast.error("User does not exist!");
        } else if (err.response?.status === 401) {
          toast.error("Login failed!");
        }
      });
  });
  const history = useHistory();
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
            .then((result) => {
              history.push("/");
            })
            .catch((err) => {
              if (err) {
                toast.error("Login failed!");
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          toast.error("Login failed!");
        }
      });
  };

  const handleClickFB = () => {
    auth
      .signInWithPopup(providerFB)
      .then(async (result) => {
        if (result.user && result.credential) {
          const credential = result.credential as firebase.auth.OAuthCredential;
          await productAPI.loginGGFB(
            true,
            result.user.email,
            result.user.uid,
            result.user.photoURL,
            result.user.displayName,
            credential.accessToken
          );
        }
        history.push("/");
      })
      .catch((err) => {
        if (err) {
          toast.error("Login failed!");
        }
      });
  };
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
          <Button
            className="login__form--button-gg"
            variant="contained"
            onClick={handleClickGG}
          >
            GOOGLE
          </Button>
          <Button
            className="login__form--button-fb"
            variant="contained"
            onClick={handleClickFB}
          >
            Facebook
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
