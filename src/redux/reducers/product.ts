import {HYDRATE} from "next-redux-wrapper";

import {productActionTypes} from "src/redux/actions";
import {handleActions} from "redux-actions";
import {createSuccessActionType} from "../helper";

const {GET_COLLECTION_BY_ID, GET_ALL_MODEL, SEARCH_PRODUCTS, GET_PRODUCT_DETAIL_BY_SLUG_LOADING}:any = productActionTypes;

const initialState = {
    collection: {},
    models: [],
    products: [],
    productDetail: {}
};

const product = handleActions(
    {
        [HYDRATE]: (state, action:any) => {
            return {...state, ...action.payload.product}
        },
        [createSuccessActionType(GET_COLLECTION_BY_ID)]: (state , action:any ) => {
            return {
                ...state,
                collection: action.payload.resultObj
            };
        },
        [createSuccessActionType(GET_ALL_MODEL)]: (state, action:any ) => {
            return {
                ...state,
                models: action.payload.resultObj
            };
        },
        [createSuccessActionType(SEARCH_PRODUCTS)]: (state , action:any ) => {
            return {
                ...state,
                products: action.payload?.data?.items || [],
            };
        },
        [createSuccessActionType(GET_PRODUCT_DETAIL_BY_SLUG_LOADING)]: (state , action:any ) => {
            return {
                ...state,
                productDetail: action.payload?.data || {},
            };
        },
    },
    initialState
);

export default product;
