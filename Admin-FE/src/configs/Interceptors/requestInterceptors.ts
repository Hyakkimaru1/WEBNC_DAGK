// others
import { AXIOS_INSTANCE } from "../enviroments";
// intercept request
const doAxiosRequestIntercept = () => {
  // const commonApiFields = {
  //   commonHeaderProperties: "Im a test, just delete me",
  // };
  AXIOS_INSTANCE.interceptors.request.use(
    async (config) => {
      const token = await localStorage.getItem("token");
      //const token = await jsCookie.get("lightening-access-token");
      const mConfig = {
        ...config,
        data: {
          // ...commonApiFields,
          ...config.data,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return mConfig;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};

export default doAxiosRequestIntercept;
