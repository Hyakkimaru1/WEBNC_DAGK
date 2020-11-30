// libs
import { combineReducers } from "redux";
// import page's reducer
import * as reducers from "@/reducers";
// types
// import { TYPES } from "@/constants/actions/Common";

// const { RESET_PAGE_REDUCERS } = TYPES;
const rootReducer = combineReducers({ ...reducers });

export default rootReducer;
