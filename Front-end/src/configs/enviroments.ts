import axios from "axios";
import { ENV_INFO } from "@/types/common";

const { CLIENT_ENV = "dev" } = process.env;

const envInfo: ENV_INFO = {
  dev: {
    //BASE_URL: "http://localhost:8001",
    //BASE_URL: "https://dack-backend.herokuapp.com",
    BASE_URL: "http://192.168.1.9:8001/"
  },
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: envInfo[CLIENT_ENV].BASE_URL,
  headers: {
    "content-type": "application/json",
  },
});

export const { BASE_URL } = envInfo[CLIENT_ENV];
