import {HYDRATE} from "next-redux-wrapper";
import {handleActions} from "redux-actions";

import {storeActionTypes} from "src/redux/actions";
import {createSuccessActionType} from '../helper'

const {GET_STORES, GET_PROVINCES, GET_TOTAL_STORES}:any = storeActionTypes;

const initialState = {
    arrStores: [],
    arrProvinces: [],
    totalStores: 0
};

const store = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return {...state, ...action.payload.store}
        },
        [createSuccessActionType(GET_STORES)]: (state: any, action: any) => {
            return {
                ...state,
                arrStores: action.payload.data || []
            };
        },
        [createSuccessActionType(GET_TOTAL_STORES)]: (state: any, action: any) => {
            return {
                ...state,
                totalStores: action.payload?.data?.total || 0
            };
        },
        [createSuccessActionType(GET_PROVINCES)]: (state: any, action: any) => {
            return {
                ...state,
                arrProvinces: action.payload.data || []
            };
        },
    },
    initialState
);

export default store;