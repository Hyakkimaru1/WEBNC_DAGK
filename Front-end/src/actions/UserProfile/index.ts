import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";
import USER, { userInitial } from "@/types/USER";

export interface IUserProfile {
  user: USER;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IUserProfile = {
  user: userInitial,
  isLoading: false,
  error: null,
};

const UserProfile = createSlice({
  name: "UserProfile",
  initialState,
  reducers: {
    getUserProfile: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    loadingUserProfile: (state) => {
      state.isLoading = true;
    },
    errorUserProfile: (state, action) => {
      state.user = userInitial;
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = UserProfile;
export const { getUserProfile, loadingUserProfile, errorUserProfile } = actions;

export const callUserProfile = ({
  _id,
  cbSuccess,
  cbError,
}: {
  _id:string;
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingUserProfile());
    await productAPI
      .getUser(_id)
      .then((res: any) => {
        dispatch(getUserProfile(res.data));
        if (cbSuccess) {
          cbSuccess(res.data);
        }
      });
  } catch (err) {
    if (cbError) {
      cbError(err.response);
    }
    dispatch(errorUserProfile({ error: err.response?.data }));
  }
};

export default reducer;
