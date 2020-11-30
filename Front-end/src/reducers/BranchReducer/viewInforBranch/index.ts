import { REDUX_ACTION } from "@/types/common/index";
import * as TYPES from "@/constants/actions/viewInforBranch";

const initialState = {
  data: null,
  loading: false,
  error: false
};

const viewInforBranch:any = (
  state = initialState,
  { type, payload }: REDUX_ACTION
) => {
  switch (type) {
    case TYPES.VIEW_INFOR_BRANCH_REQUEST:
      return {
        ...state,
        loading: true
      };
    case TYPES.VIEW_INFOR_BRANCH_SUCCESS:
      // console.log(payload);

      return {
        ...state,
        loading: false,
        data: payload.data.data
      };
    case TYPES.VIEW_INFOR_BRANCH_ERROR:
      return {
        ...state,
        error: true
      };
    default:
      return { ...state };
  }
};
export default viewInforBranch;
