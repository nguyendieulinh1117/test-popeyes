import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { basketActionTypes } from "src/redux/actions";
import { createSuccessActionType } from "../helper";

const { GET_BASKET, CLEAR_DATA_BASKET, CHECK_STOCK_BASKET } = basketActionTypes;
type stateType = {
    basketData: any;
    checkStockData: any;
};
const initialState: stateType = {
    basketData: {},
    checkStockData: [],
};

const basket = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.home };
        },
        [createSuccessActionType(GET_BASKET)]: (state: any, action: any) => {
            return {
                ...state,
                basketData: action.payload.data || [],
            };
        },
        [createSuccessActionType(CHECK_STOCK_BASKET)]: (state: any, action: any) => {
            return {
                ...state,
                checkStockData: action.payload.data.items || [],
            };
        },
        [CLEAR_DATA_BASKET]: (state: any) => {
            return {
                ...state,
                basketData: {},
            };
        },
    },
    initialState
);

export default basket;
