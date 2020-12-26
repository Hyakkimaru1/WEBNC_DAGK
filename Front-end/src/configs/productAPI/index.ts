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
  createNewBoard: (hasPassword: boolean, password: string) => {
    return AXIOS_INSTANCE.post(API.CREATE_A_BOARD, { hasPassword, password });
  },
  confirmCode: (codeConfirm: string, _id: string) =>
    AXIOS_INSTANCE.post(API.CONFIRM_CODE, { codeConfirm, _id }),
  joinBoard: (_id: string | null, password: string, socketId: string) =>
    AXIOS_INSTANCE.post(API.JOIN_THE_BOARD, { _id, password, socketId }),
  getHistory: (page: number) => AXIOS_INSTANCE.post(API.HISTORY_USER, { page }),
  getTopRanking: () => AXIOS_INSTANCE.get(API.TOP_RANKING),
};
