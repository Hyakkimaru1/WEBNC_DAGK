import { productAPI } from "../../configs/productAPI";
import { AppThunk } from "../../configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isChanged: false,
    error: null,
  };
  
  const DisableUser = createSlice({
    name: "DisableUser",
    initialState,
    reducers: {
      changed: (state,action) => {
        state.isChanged = true;
      },
      changing: (state) => {
        state.isChanged = false;
      },
      changeError: (state, action) => {
        state.isChanged = false;
        state.error = action.payload.error;
      },
    },
  });
  
  const { reducer, actions } = DisableUser;
  export const { changed, changing, changeError } = actions;
  export const callDisableUser = ({
    username,
    status,
    cbSuccess,
    cbError,
  }: {
    username: string;
    status:boolean;
    cbSuccess?: any;
    cbError?: any;
  }): AppThunk => {
          return async (dispatch) => {
              try {
                  dispatch(changing());
                  await productAPI.disableUser(username,status).then((res: any) => {
                      dispatch(changed(res.data));
                      if (cbSuccess) {
                          cbSuccess(res.data);
                      }
                  });
              } catch (err) {
                  dispatch(changeError({ error: err.response?.data }));
                  if (cbError) {
                      cbError(err.response?.data);
                  }
              }
          };
      };

export default reducer;