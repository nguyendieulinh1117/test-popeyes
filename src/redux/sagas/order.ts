import { call, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { loadingActions, orderActionTypes } from "src/redux/actions";
import { processCallbackAction, processLoadingAction } from "../helper";
import { RequestApi } from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const { GET_LIST_ORDER, GET_ORDER_BY_CODE, CREATE_ORDER, GET_ALL_ORDER, CANCEL_ORDER, CHANGE_COD } =
    orderActionTypes;

const { startLoading, finishLoading } = loadingActions;

const _getOrders = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.order.getOrders, payload);
};

const _getAllOrders = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.order.getOrders, payload);
};

function* _getOrderByCode({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    yield put(startLoading(GET_ORDER_BY_CODE));
    try {
        const options = {
            ...apiConfig.order.getOrderByCode,
            path: `${apiConfig.order.getOrderByCode.path}/${params.id}`,
        };
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    } finally {
        yield put(finishLoading(GET_ORDER_BY_CODE));
    }
}

const _createOrder = ({ payload }: RequestApi<any>) => {
    return processCallbackAction(apiConfig.order.createOrder, payload);
};

function* _cancelOrder({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.order.createOrder,
            path: `${apiConfig.order.createOrder.path}/${params.id}/cancel`,
        };

        const result = yield call(sendRequest, options, params.body);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

function* _changeCOD({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    yield put(loadingActions.startLoading(CHANGE_COD));
    try {
        const options = {
            ...apiConfig.order.createOrder,
            path: `${apiConfig.order.createOrder.path}/${params.code}/change-cod`,
        };
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    } finally {
        yield put(loadingActions.finishLoading(CHANGE_COD));
    }
}

export default [
    takeLatest(GET_LIST_ORDER, _getOrders),
    takeLatest(GET_ORDER_BY_CODE, _getOrderByCode),
    takeLatest(CREATE_ORDER, _createOrder),
    takeLatest(GET_ALL_ORDER, _getAllOrders),
    takeLatest(CANCEL_ORDER, _cancelOrder),
    takeLatest(CHANGE_COD, _changeCOD),
];
