import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";
import { initialState } from "../AddBoardSlide";

const HistoryUserSlide = createSlice({
  name: "HistoryUserSlide",
  initialState,
  reducers: {
    historyEnd: (state) => {
      state.isLoading = false;
    },
    loadingHistory: (state) => {
      state.isLoading = true;
    },
    errorHistory: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = HistoryUserSlide;
export const { historyEnd, loadingHistory, errorHistory } = actions;

export const callHistoryUserSlide = ({
  page,
  cbSuccess,
  cbError,
}: {
  page: number ;
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingHistory());
    await productAPI.getHistory(page).then((res: any) => {
      dispatch(historyEnd());
      if (cbSuccess) {
        cbSuccess(res.data);
      }
    });
  } catch (err) {
    dispatch(errorHistory({ error: err.response?.data }));
    if (cbError) {
      cbError(err.response?.data);
    }
  }
};

export default reducer;
