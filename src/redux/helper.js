import {loadingActions} from 'src/redux/actions';
import {call, put} from 'redux-saga/effects';
import {handleApiResponse, sendRequest} from '@utils/api';
import {Action, PayloadType, RequestApi} from "@common/Models/ApiModels";
import { isEmptyObject } from '@utils';

const {startLoading, finishLoading} = loadingActions;

export const createSuccessActionType = (type) => `${type}_SUCCESS`;
export const createFailureActionType = (type) => `${type}_FAILURE`;


export function* processLoadingAction(options, {payload, type}) {
    const SUCCESS = createSuccessActionType(type);
    const FAILURE = createFailureActionType(type);
    yield put(startLoading(type));
    try {
        const response = yield call(sendRequest, options, payload);
        yield put({
            type: response.success ? SUCCESS : FAILURE,
            payload: response.responseData
        });

    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true
        });
    }
    yield put(finishLoading(type));
}

export function* processAction(options, {payload, type}) {
    const SUCCESS = createSuccessActionType(type);
    const FAILURE = createFailureActionType(type);
    try {
        const response = yield call(sendRequest, options, payload);
        yield put({
            type: response.success ? SUCCESS : FAILURE,
            payload: response.responseData
        });
    } catch (e) {
        yield put({
            type: FAILURE,
            payload: e,
            error: true
        });
    }
}

export function* processCallbackAction(options, payload) {
    const {params, onCompleted, onError} = payload;
    try {
        const result = yield call(sendRequest, options, params);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}
