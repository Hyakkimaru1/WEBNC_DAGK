// Libs
import React from "react";
// hooks
import ROUTERS from "@/constants/routers";
import { CONFIG } from "@/constants/config";
// components
import LoginForm from "@/pages/Login";
import jwt from "jsonwebtoken";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { productAPI } from "@/configs/productAPI";
import { useState } from 'react';
// constants

export const UserContext = React.createContext(null);

interface Props {
  children: JSX.Element[] | JSX.Element;
}

const jwtDecode = (token: string) => jwt.decode(token);

export const UserProvider: React.FC<Props> = (props) => {
  const { children } = props;
  // const token = localStorage.getItem("token") || "";
  const history = useHistory();
  const token = localStorage.getItem(CONFIG.TOKEN) || "";
  const [result,setResult] = useState(true);

  useEffect(() => {
    if (token !== "")
      {
        const checkToken = async () => {
          await productAPI.checkToken().then(data => {
            setResult(data.data)
          });
        };
        checkToken();
      }
  }, [token]);

  if (token && result) {
    const user: any = jwtDecode(token);
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  } else {
    localStorage.removeItem("token");
  }
  // Redirect to login
  history.push(ROUTERS.LOGIN);
  return <LoginForm />;
};
