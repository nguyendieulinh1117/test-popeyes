import { createAction } from 'redux-actions';

export const actionTypes = {
    GET_STORES: 'store/GET_STORE',
    GET_PROVINCES: 'store/GET_PROVINCES',
    GET_PROVINCE_DETAIL: 'store/GET_PROVINCE_DETAIL',
    GET_TOTAL_STORES: 'store/GET_TOTAL_STORES',

}

export const actions = {
    getStores: createAction(actionTypes.GET_STORES),
    getProvinces: createAction(actionTypes.GET_PROVINCES),
    getProvinceDetail: createAction(actionTypes.GET_PROVINCE_DETAIL),
    getTotalStores: createAction(actionTypes.GET_TOTAL_STORES),
}