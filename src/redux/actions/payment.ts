import { createAction } from 'redux-actions';

export const actionTypes = {
    GET_PAYMENT_METHOD: 'payment/GET_PAYMENT_METHOD',
    ORDER_PAYMENT: 'payment/ORDER_PAYMENT',
   
}

export const actions = {
    getPaymentMethod: createAction(actionTypes.GET_PAYMENT_METHOD),
    orderPayment: createAction(actionTypes.ORDER_PAYMENT),
}