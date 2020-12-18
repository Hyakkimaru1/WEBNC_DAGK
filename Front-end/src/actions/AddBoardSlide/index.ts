import { AppThunk } from "@/configs/Redux/store";
import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "@/configs/productAPI";

export interface RoomLoading {
  id: number | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: RoomLoading = {
  id: null,
  isLoading: false,
  error: null,
};

const addBoard = createSlice({
  name: "addBoard",
  initialState,
  reducers: {
    addboard: (state, action) => {
      state.id = action.payload;
      state.isLoading = false;
    },
    loadingCreateBoard: (state) => {
      state.isLoading = true;
    },
    errorCreateBoard: (state, action) => {
      state.id = null;
      state.isLoading = false;
      state.error = action.payload.error;
    },
  },
});

const { reducer, actions } = addBoard;
export const { addboard, loadingCreateBoard, errorCreateBoard } = actions;

export const callApiCreateBoard = ({
  params,
  cbSuccess,
}: {
  params: {
    hasPassword: boolean;
    password: string;
  };
  cbSuccess?: (...args: Array<any>) => any;
}): AppThunk => async (dispatch) => {
  try {
    dispatch(loadingCreateBoard());
    await productAPI
      .createNewBoard(params.hasPassword, params.password)
      .then((res: any) => {
        dispatch(addboard(res.data.id));
        if (cbSuccess) {
          cbSuccess(res.data.id);
        }
      });
  } catch (err) {
    dispatch(errorCreateBoard({ error: err.response?.data }));
  }
};

export default reducer;
