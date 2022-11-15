import { handleActions } from "redux-actions";
import { loadingActionTypes } from "../actions";

const { START_LOADING, FINISH_LOADING } = loadingActionTypes;

const initialState = {};

const loading = handleActions(
  {
    [START_LOADING]: (state, action: any) => {
      return {
        ...state,
        [action.payload]: true,
      };
    },
    [FINISH_LOADING]: (state, action: any) => {
      return {
        ...state,
        [action.payload]: false,
      };
    },
  },
  initialState
);

export default loading;
