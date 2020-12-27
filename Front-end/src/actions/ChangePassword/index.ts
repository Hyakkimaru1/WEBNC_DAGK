import { productAPI } from "@/configs/productAPI";
import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isChanged: false,
  error: null,
};

const ChangePassword = createSlice({
  name: "ChangePassword",
  initialState,
  reducers: {
    changed: (state) => {
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

const { reducer, actions } = ChangePassword;
export const { changed, changing, changeError } = actions;
export const callChangePassword = ({
  username,
  password,
  newPassword,
  cbSuccess,
  cbError,
}: {
  username: any;
  password: any;
  newPassword: any;
  cbSuccess?: any;
  cbError?: any;
}): AppThunk => {
        return async (dispatch) => {
            try {
                dispatch(changing());
                await productAPI.newPassword(username, password, newPassword).then((res: any) => {
                    dispatch(changed());
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
