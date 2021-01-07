import axios from "axios";
import { ENV_INFO } from "@/types/common";

const { CLIENT_ENV = "dev" } = process.env;

const envInfo: ENV_INFO = {
  dev: {
    BASE_URL: "http://localhost:8001",
    // BASE_URL: "https://test-app1332.herokuapp.com/",
  },
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: envInfo[CLIENT_ENV].BASE_URL,
});

export const { BASE_URL } = envInfo[CLIENT_ENV];

export const BASE_URL_LOGIN = envInfo.login;
