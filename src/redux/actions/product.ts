import {createAction} from "redux-actions";

export const actionTypes = {
    GET_COLLECTION_BY_ID: 'product/GET_COLLECTION_BY_ID',
    CREATE_COLLECTION: 'product/CREATE_COLLECTION',
    GET_ALL_MODEL: 'product/GET_ALL_MODEL',
    GET_PRODUCT_DETAIL_BY_SLUG: 'product/GET_PRODUCT_DETAIL_BY_SLUG',
    GET_PRODUCT_DETAIL_BY_SLUG_LOADING: 'product/GET_PRODUCT_DETAIL_BY_SLUG_LOADING',
    GET_PRODUCTS: 'product/GET_PRODUCTS',
    GET_COMBO_DETAIL: 'product/GET_COMBO_DETAIL',
    SEARCH_PRODUCTS: 'product/SEARCH_PRODUCTS',
}

export const actions = {
    getCollectionById: createAction(actionTypes.GET_COLLECTION_BY_ID),
    getAllModel: createAction(actionTypes.GET_ALL_MODEL),
    createCollection: createAction(actionTypes.CREATE_COLLECTION),
    getProductDetailBySlug: createAction(actionTypes.GET_PRODUCT_DETAIL_BY_SLUG),
    getProducts: createAction(actionTypes.GET_PRODUCTS),
    searchProducts: createAction(actionTypes.SEARCH_PRODUCTS),
    getComboDetail: createAction(actionTypes.GET_COMBO_DETAIL),
    getProductDetailBySlugLoading: createAction(actionTypes.GET_PRODUCT_DETAIL_BY_SLUG_LOADING),

}