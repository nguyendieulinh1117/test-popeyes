import { createAction } from "redux-actions";

export const actionTypes = {
    GET_LIST_ORDER: "order/GET_LIST_ORDER",
    GET_ORDER_BY_CODE: "order/GET_ORDER_BY_CODE",
    CREATE_ORDER: "order/CREATE_ORDER",
    GET_ALL_ORDER: "order/GET_ALL_ORDER",
    CANCEL_ORDER: "order/CANCEL_ORDER",
    CHANGE_COD: "order/CHANGE_COD",
};

export const actions = {
    getOrders: createAction(actionTypes.GET_LIST_ORDER),
    getOrderByCode: createAction(actionTypes.GET_ORDER_BY_CODE),
    createOrder: createAction(actionTypes.CREATE_ORDER),
    getAllOrders: createAction(actionTypes.GET_ALL_ORDER),
    cancelOrder: createAction(actionTypes.CANCEL_ORDER),
    changeCOD: createAction(actionTypes.CHANGE_COD),
};
