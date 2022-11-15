import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { orderActionTypes } from "src/redux/actions";
import { createSuccessActionType } from "../helper";

const { GET_LIST_ORDER, GET_ALL_ORDER } = orderActionTypes;
type stateType = {
    dataOrders: any;
    orderDetail: any;
    dataAllOrder: any;
};
const initialState: stateType = {
    dataOrders: [],
    orderDetail: {},
    dataAllOrder: {},
};

const order = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.home };
        },
        [createSuccessActionType(GET_LIST_ORDER)]: (state: any, action: any) => {
            return {
                ...state,
                dataOrders: action.payload.data.items || [],
            };
        },
        [createSuccessActionType(GET_ALL_ORDER)]: (state: any, action: any) => {
            return {
                ...state,
                dataAllOrder: action.payload.data || [],
            };
        },
    },
    initialState
);

export default order;
