import { productAPI } from "../../configs/productAPI";
import { AppThunk } from "../../configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    isChanged: false,
    error: null,
  };
  
  const GetUserHistory = createSlice({
    name: "GetUserHistory",
    initialState,
    reducers: {
      changed: (state,action) => {
        state.data = action.payload;
        state.isChanged = true;
      },
      changing: (state) => {
        state.isChanged = false;
      },
      changeError: (state, action) => {
        state.data = null;
        state.isChanged = false;
        state.error = action.payload.error;
      },
    },
  });
  
  const { reducer, actions } = GetUserHistory;
  export const { changed, changing, changeError } = actions;
  export const callGetUserHistory = ({
    id,
    cbSuccess,
    cbError,
  }: {
    id: string;
    cbSuccess?: any;
    cbError?: any;
  }): AppThunk => {
          return async (dispatch) => {
              try {
                  dispatch(changing());
                  await productAPI.getUserHistory(id).then((res: any) => {
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