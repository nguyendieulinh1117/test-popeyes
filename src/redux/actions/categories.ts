import {createAction} from "redux-actions";

export const actionTypes = {
    GET_LIST_CATEGORIES: 'product/GET_LIST_CATEGORIES',
    GET_CATEGORIES_SLUG: 'product/GET_CATEGORIES_SLUG',
    GET_PRODUCT_FILTER: 'product/GET_PRODUCT_FILTER',
}

export const actions = {
    getListCategories: createAction(actionTypes.GET_LIST_CATEGORIES),
    getCategoriesSlug: createAction(actionTypes.GET_CATEGORIES_SLUG),
    getProductFilter: createAction(actionTypes.GET_PRODUCT_FILTER),
}