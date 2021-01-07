import { productAPI } from "@/configs/productAPI";
import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const ForgotPassword = createSlice({
  name: "ForgotPassword",
  initialState,
  reducers: {
    forgotPasswordSuccess: (state) => {
      state.isLoading = false;
    },
    forgotPasswordFetching: (state) => {
      state.isLoading = true;
    },
    forgotPasswordError: (state) => {
      state.isLoading = false;
    },
  },
});

const { reducer, actions } = ForgotPassword;
export const { forgotPasswordSuccess, forgotPasswordFetching, forgotPasswordError } = actions;
export const callForgotPassword = ({
  email,
  cbSuccess,
  cbError,
}: {
  email:string;
  cbSuccess?: any;
  cbError?: any;
}): AppThunk => {
        return async (dispatch) => {
            try {
                dispatch(forgotPasswordFetching());
                await productAPI.forgotPassword(email).then((res: any) => {
                    dispatch(forgotPasswordSuccess());
                    if (cbSuccess) {
                        cbSuccess(res.data);
                    }
                });
            } catch (err) {
                dispatch(forgotPasswordError());
                if (cbError) {
                    cbError(err.response?.data);
                }
            }
        };
    };

export default reducer;
