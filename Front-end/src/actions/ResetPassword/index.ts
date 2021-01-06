import { productAPI } from "@/configs/productAPI";
import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const ResetPassword = createSlice({
  name: "ResetPassword",
  initialState,
  reducers: {
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
    },
    resetPasswordFetching: (state) => {
      state.isLoading = true;
    },
    resetPasswordError: (state) => {
      state.isLoading = false;
    },
  },
});

const { reducer, actions } = ResetPassword;
export const { resetPasswordSuccess, resetPasswordFetching, resetPasswordError } = actions;
export const callResetPassword = ({
  paramsSend,
  cbSuccess,
  cbError,
}: {
  paramsSend:{
    params:any;
    password:string;
  }
  cbSuccess?: any;
  cbError?: any;
}): AppThunk => {
        return async (dispatch) => {
            try {
                dispatch(resetPasswordFetching());
                await productAPI.resetPassword(paramsSend.params,paramsSend.password).then((res: any) => {
                    dispatch(resetPasswordSuccess());
                    if (cbSuccess) {
                        cbSuccess(res.data);
                    }
                });
            } catch (err) {
                dispatch(resetPasswordError());
                if (cbError) {
                    cbError(err.response?.data);
                }
            }
        };
    };

export default reducer;
