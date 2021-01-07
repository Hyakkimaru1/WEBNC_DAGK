import { configureStore, Action } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./combinedReducer";
import { ThunkAction } from "redux-thunk";
export const store = configureStore({ reducer: rootReducer });

export type DISPATCH_TYPE = typeof store.dispatch;
export type ROOT_STATE = ReturnType<typeof rootReducer>;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
