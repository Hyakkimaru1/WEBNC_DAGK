import { AXIOS_INSTANCE } from "@/configs/enviroments";
import { API } from "@/constants/API/index";

export const productAPI = {
  login: (user: string, password: string) => {
    return AXIOS_INSTANCE.post(API.LOGIN, { user, password });
  },
  loginGGFB: (
    loginfb: boolean,
    username: string | null,
    password: string | null,
    avatar: string | null,
    name: string | null,
    idToken?: string
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
  register: (user: string, password: string) => {
    return AXIOS_INSTANCE.post(API.REGISTER, { user, password });
  },
};
