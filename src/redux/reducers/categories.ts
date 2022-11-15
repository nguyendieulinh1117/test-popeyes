import {HYDRATE} from "next-redux-wrapper";

import {categoriesActionTypes} from "src/redux/actions";
import {handleActions} from "redux-actions";
import {createSuccessActionType} from "../helper";

const {GET_LIST_CATEGORIES, GET_PRODUCT_FILTER}:any = categoriesActionTypes;

const initialState = {
    allCategories: {},
    productFilter: [],
};

const categories = handleActions(
    {
        [HYDRATE]: (state, action:any) => {
            return {...state, ...action.payload.categories}
        },
        [createSuccessActionType(GET_LIST_CATEGORIES)]: (state , action:any ) => {
            return {
                ...state,
                allCategories: action.payload.data
            };
        },
        [createSuccessActionType(GET_PRODUCT_FILTER)]: (state , action:any ) => {
            return {
                ...state,
                productFilter: action.payload.data
            };
        },
    },
    initialState
);

export default categories;
