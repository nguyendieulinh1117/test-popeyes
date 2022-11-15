import {createAction} from "redux-actions";

export const actionTypes = {
    GET_LIST_PROMOTION: "home/GET_LIST_PROMOTION",
    PROMOTION_CHECK: 'promotions/PROMOTION_CHECK',
    GET_LIST_VOUCHER: 'promotions/GET_LIST_VOUCHER',
    DELETE_VOUCHER: 'promotions/DELETE_VOUCHER',
}

export const actions = {
    getAllPromotion: createAction(actionTypes.GET_LIST_PROMOTION),
    checkPromotion: createAction(actionTypes.PROMOTION_CHECK),
    getListVoucher: createAction(actionTypes.GET_LIST_VOUCHER),
    deleteVoucher: createAction(actionTypes.DELETE_VOUCHER),
}