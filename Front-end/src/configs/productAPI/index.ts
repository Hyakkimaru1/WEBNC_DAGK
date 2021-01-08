import { AXIOS_INSTANCE } from "@/configs/enviroments";
import { API } from "@/constants/API/index";

export const productAPI = {
  login: (username: string, password: string) => {
    return AXIOS_INSTANCE.post(API.LOGIN, { username, password });
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
  createNewBoard: (hasPassword: boolean, password: string, time: number) => {
    return AXIOS_INSTANCE.post(API.CREATE_A_BOARD, { hasPassword, password,time });
  },
  confirmCode: (codeConfirm: string, _id: string) =>
    AXIOS_INSTANCE.post(API.CONFIRM_CODE, { codeConfirm, _id }),
  joinBoard: (_id: string | null, password: string, socketId: string) =>
    AXIOS_INSTANCE.post(API.JOIN_THE_BOARD, { _id, password, socketId }),
  getHistory: (page: number) => AXIOS_INSTANCE.post(API.HISTORY_USER, { page }),
  getTopRanking: () => AXIOS_INSTANCE.get(API.TOP_RANKING),
  newPassword: (username: string, password:string, newPassword: string) => AXIOS_INSTANCE.put(API.CHANGE_PASSWORD, {username, password, newPassword}),
  forgotPassword: (email:string) => AXIOS_INSTANCE.post(API.FORGOT_PASSWORD,{email}),
  resetPassword: (params:string,password:string) => AXIOS_INSTANCE.put(`${API.RESET_PASSWORD}/${params}`,{password}),
  getUser: (_id:string) => AXIOS_INSTANCE.get(`${API.USER_PROFILE}/${_id}`),
  updateProfile: (name:string) => AXIOS_INSTANCE.put(API.UPDATE_USER_PROFILE,{name},)
};
