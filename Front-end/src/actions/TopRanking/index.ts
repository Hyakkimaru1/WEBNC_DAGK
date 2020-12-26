import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";
import USER from "@/types/USER";

export interface TopRanking {
  id: number | null;
  isLoading: boolean;
  error: string | null;
  data: USER[]
}

const initialState: TopRanking = {
  id: null,
  isLoading: false,
  error: null,
  data: []
};

const topRanking = createSlice({
  name: "topRanking",
  initialState,
  reducers: {
    getTopRanking: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    loadingTopRanking: (state) => {
      state.isLoading = true;
    },
    errorTopRanking: (state, action) => {
      state.data = [];
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = topRanking;
export const { getTopRanking, loadingTopRanking, errorTopRanking } = actions;

export const getAllTopRanking = ({
  cbError,
}: {
  cbError?: any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingTopRanking());
    await productAPI
      .getTopRanking()
      .then((res: any) => {
        dispatch(getTopRanking(res.data));
      });
  } catch (err) {
    dispatch(errorTopRanking({ error: err.response?.data }));
    if (cbError) {
      cbError(err.response?.data);
    }
  }
};

export default reducer;
