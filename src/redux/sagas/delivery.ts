import {  takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { deliveryActionTypes } from "src/redux/actions";
import { processCallbackAction, processLoadingAction } from "@redux/helper";

const {
    DELIVERY_CALCULATE_FEE,
    DELIVERY,
    DELIVERY_SERVICES
} = deliveryActionTypes;

const _services = ({payload}: any) => {
    return processCallbackAction(apiConfig.delivery.services, payload);
}

const _calculateFee = (payload: any) => {
    return processLoadingAction(apiConfig.delivery.calculateFee, payload);
}

const _delivery = ({ payload }: any) => {
    return processCallbackAction(apiConfig.delivery.delivery, payload);
}

export default [
    takeLatest(DELIVERY_CALCULATE_FEE, _calculateFee),
    takeLatest(DELIVERY_SERVICES, _services),
    takeLatest(DELIVERY, _delivery),
];

