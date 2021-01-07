import { API } from "../../constants/API";
import { AXIOS_INSTANCE } from "./../../configs/enviroments";

export const productAPI = {
  login: (username: string, password: string) => {
    return AXIOS_INSTANCE.post(API.LOGIN, { username, password });
  },
  loginGGFB: (
    loginfb: string | boolean,
    username: string | null,
    password: string | null,
    avatar: string | null,
    name: string | null,
    idToken: string | undefined
  ) => {
    return AXIOS_INSTANCE.post(API.LOGIN_GG_FB, {
      loginfb,
      username,
      password,
      fbgg: true,
      avatar,
      name,
      idToken,
    });
  },
  signUp: (user: string, password: string) => {
    return AXIOS_INSTANCE.post(API.SIGNUP, {
      user,
      password,
    });
  },
  getUsers: (typeValue: string) => {
    return AXIOS_INSTANCE.get(`${API.GETUSERS}?typeValue=${typeValue}`);
  },
};
