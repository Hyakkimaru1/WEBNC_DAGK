import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";
import { initialState } from "../AddBoardSlide";

const joinBoard = createSlice({
  name: "joinBoard",
  initialState,
  reducers: {
    joinboard: (state, action) => {
      state.id = action.payload;
      state.isLoading = false;
    },
    loadingJoinBoard: (state) => {
      state.isLoading = true;
    },
    errorJoinBoard: (state, action) => {
      state.id = null;
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = joinBoard;
export const { joinboard, loadingJoinBoard, errorJoinBoard } = actions;

export const callApiJoinBoard = ({
  params,
  cbSuccess,
  cbError,
}: {
  params: {
    _id: string | null;
    password: string;
    socketId: string;
  };
  cbSuccess?: (...args: Array<any>) => any;
  cbError?: any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingJoinBoard());
    await productAPI
      .joinBoard(params._id, params.password, params.socketId)
      .then((res: any) => {
        dispatch(joinboard(res.data.id));
        if (cbSuccess) {
          cbSuccess(res.data);
        }
      });
  } catch (err) {
    dispatch(errorJoinBoard({ error: err.response?.data }));
    if (cbError) {
      cbError(err.response?.data);
    }
  }
};

export default reducer;
