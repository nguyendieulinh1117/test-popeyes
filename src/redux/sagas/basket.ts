import { call, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { basketActionTypes, loadingActions } from "src/redux/actions";
import {
    createFailureActionType,
    createSuccessActionType,
    processCallbackAction,
    processLoadingAction,
} from "../helper";
import { RequestApi } from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {startLoading, finishLoading} = loadingActions;

const {
    GET_BASKET,
    UPDATE_BASKET,
    CREATE_BASKET,
    DELETE_BASKET,
    GET_BASKET_BUY_NOW,
    CHECK_STOCK_BASKET,
    CHECK_STOCK
} = basketActionTypes;

function* _getBasket({ payload }: RequestApi<any>): any {
    const SUCCESS = createSuccessActionType(GET_BASKET);
    const FAILURE = createFailureActionType(GET_BASKET);
    yield put(startLoading(GET_BASKET));
    try {
        const options = {
            ...apiConfig.basket.getBasket,
            path: `${apiConfig.basket.getBasket.path}/${payload}`,
        };
        const result = yield call(sendRequest, options);
        yield put({
            type: result.success ? SUCCESS : FAILURE,
            payload: result.responseData,
        });
    } catch (error) {
        yield put({
            type: FAILURE,
            payload: error,
            error: true,
        });
    }
    yield put(finishLoading(GET_BASKET));
}

function* _getBasketBuyNow({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.basket.getBasket,
            path: `${apiConfig.basket.getBasket.path}/${params}`,
        };
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

const _createBasket = ({ payload }: any) => {
    return processCallbackAction(apiConfig.basket.storeBasket, payload);
};

function* _updateBasket({ payload: { id, params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.basket.updateBasket,
            path: `${apiConfig.basket.updateBasket.path}/${id}`,
        };
        const result = yield call(sendRequest, options, params);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

function* _deleteBasket({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.basket.deleteBasket,
            path: `${apiConfig.basket.deleteBasket.path}/${params.id}`,
        };
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

function* _checkStockBasket({ payload }: RequestApi<any>): any {
    const SUCCESS = createSuccessActionType(CHECK_STOCK_BASKET);
    const FAILURE = createFailureActionType(CHECK_STOCK_BASKET);
    try {
        const options = {
            ...apiConfig.basket.getBasket,
            path: `${apiConfig.basket.getBasket.path}/${payload}/stocks`,
        };
        const result = yield call(sendRequest, options);
        yield put({
            type: result.success ? SUCCESS : FAILURE,
            payload: result.responseData,
        });
    } catch (error) {
        yield put({
            type: FAILURE,
            payload: error,
            error: true,
        });
    }
}

function* _checkStock({ payload: { params, onCompleted, onError }}: RequestApi<any>): any {
   
    try {
        const options = {
            ...apiConfig.basket.getBasket,
            path: `${apiConfig.basket.getBasket.path}/${params.id}/stocks`,
        };
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error)
    }
}

export default [
    takeLatest(GET_BASKET, _getBasket),
    takeLatest(CREATE_BASKET, _createBasket),
    takeLatest(UPDATE_BASKET, _updateBasket),
    takeLatest(DELETE_BASKET, _deleteBasket),
    takeLatest(GET_BASKET_BUY_NOW, _getBasketBuyNow),
    takeLatest(CHECK_STOCK_BASKET, _checkStockBasket),
    takeLatest(CHECK_STOCK, _checkStock)
];
