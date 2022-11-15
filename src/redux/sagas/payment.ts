import { takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { paymentActionTypes } from "src/redux/actions";
import { processCallbackAction, processLoadingAction } from "@redux/helper";
import { RequestApi } from "@common/Models/ApiModels";

const {
    GET_PAYMENT_METHOD,
    ORDER_PAYMENT,
} = paymentActionTypes;

const _getPaymentMethod = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.payment.getPaymentMethod, payload);
}

const _orderPayment = ({payload}: RequestApi<any>) => {
    return processCallbackAction(apiConfig.payment.orderPayment, payload);
}

export default [
    takeLatest(GET_PAYMENT_METHOD, _getPaymentMethod),
    takeLatest(ORDER_PAYMENT, _orderPayment)
];

