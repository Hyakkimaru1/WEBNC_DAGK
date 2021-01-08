import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";

const initialState = {
  isLoading: false,
  error: null,
};

const UpdateUserProfile = createSlice({
  name: "UpdateUserProfile",
  initialState,
  reducers: {
    getUpdateUserProfile: (state) => {
      state.isLoading = false;
    },
    loadingUpdateUserProfile: (state) => {
      state.isLoading = true;
    },
    errorUpdateUserProfile: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = UpdateUserProfile;
export const {
  getUpdateUserProfile,
  loadingUpdateUserProfile,
  errorUpdateUserProfile,
} = actions;

export const callUpdateUserProfile = ({
  name,
  cbSuccess,
  cbError,
}: {
  name: string;
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingUpdateUserProfile());
    await productAPI.updateProfile(name).then((res: any) => {
      dispatch(getUpdateUserProfile());
      if (cbSuccess) {
        cbSuccess(res.data);
      }
    });
  } catch (err) {
    if (cbError) {
      cbError(err.response);
    }
    dispatch(errorUpdateUserProfile({ error: err.response?.data }));
  }
};

export default reducer;
