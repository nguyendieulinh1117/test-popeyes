import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { dynamicActionTypes } from "src/redux/actions";
import { createSuccessActionType } from "../helper";

const { GET_DYNAMIC_CONTENT_BY_KEY, GET_DYNAMIC_CONTENT_COMMON } = dynamicActionTypes;
type stateType = {
    contentByKey: any;
    contentCommons: any;
};
const initialState: stateType = {
    contentByKey: {},
    contentCommons: [],
};

const dynamic = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.dynamic };
        },
        [createSuccessActionType(GET_DYNAMIC_CONTENT_BY_KEY)]: (state: any, action: any) => {
            return {
                ...state,
                contentByKey: action.payload.data || [],
            };
        },
        [createSuccessActionType(GET_DYNAMIC_CONTENT_COMMON)]: (state: any, action: any) => {
            return {
                ...state,
                contentCommons: action.payload.data || [],
            };
        },
    },
    initialState
);

export default dynamic;
