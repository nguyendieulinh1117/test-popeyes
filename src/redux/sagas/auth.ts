import { call, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { authActions, authActionTypes, loadingActions } from "src/redux/actions";
import { RequestApi } from "@common/Models/ApiModels";
import {
    createFailureActionType,
    createSuccessActionType,
    processCallbackAction,
    processLoadingAction,
} from "@redux/helper";
import { callGetCookies, callPostCookies, handleApiResponse, sendRequest } from "@utils/api";
import { setObjectData, setStringData, removeItem } from "@utils/localStorage";
import { storageKeys } from "@constants";

const {
    GET_PROFILE,
    UPDATE_PROFILE,
    LOG_IN,
    REGISTER,
    CHANGE_PASSWORD,
    LOGOUT,
    CHECK_ACCOUNT_EXIST,
    FORGET_PASSWORD,
    RESET_PASSWORD,
} = authActionTypes;

function* _getProfile({ payload }: any): any {
    const SUCCESS = createSuccessActionType(GET_PROFILE);
    const FAILURE = createFailureActionType(GET_PROFILE);
    yield put(loadingActions.startLoading(GET_PROFILE));
    try {
        const response = yield call(sendRequest, apiConfig.authenticate.getUserByToken, payload);
        setObjectData(storageKeys.USER_DATA, response?.responseData?.data);
        yield put({
            type: response.success ? SUCCESS : FAILURE,
            payload: response?.responseData?.data,
        });
    } catch (error) {
        yield put({
            type: FAILURE,
            payload: error,
            error: true,
        });
    }
    yield put(loadingActions.finishLoading(GET_PROFILE));
}

const _updateProfile = ({ payload }: any) => {
    return processCallbackAction(apiConfig.authenticate.updateProfile, payload);
};

const _changePassword = ({ payload }: any) => {
    return processCallbackAction(apiConfig.authenticate.changePassword, payload);
};

function* _logIn({ payload: { params, onCompleted, onError } }: any): any {
    try {
        const result = yield call(sendRequest, apiConfig.authenticate.login, params);
        const responseData = result?.responseData;

        if (responseData?.success && responseData?.data) {
            setStringData(storageKeys.USER_TOKEN, responseData?.data.accessToken);
            setStringData(storageKeys.USER_REFRESH_TOKEN, responseData?.data.refreshToken);
            callPostCookies();
            setTimeout(() => {
                callGetCookies();
            }, 3000);
            yield put(authActions.getProfile());
            handleApiResponse(result, onCompleted, onError);
        } else {
            onError(result?.responseData);
        }
    } catch (error) {
        onError(error);
    }
}

function* _logout({ payload: { onCompleted } }: any) {
    removeItem(storageKeys.USER_TOKEN);
    removeItem(storageKeys.USER_DATA);
    removeItem(storageKeys.USER_REFRESH_TOKEN);
    // yield put(accountActions.setProfile({data: {}}));
    // yield put(checkoutActions.deleteCheckoutLocal());
    onCompleted();
}

const _register = ({ payload }: any) => {
    return processCallbackAction(apiConfig.authenticate.register, payload);
};

function* _checkAccountExist({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.authenticate.userExist,
            path: `${apiConfig.authenticate.userExist.path}/${params}/exists`,
        };
        const result = yield call(sendRequest, options);

        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

function* _forgetPassword({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.authenticate.forgetPassword,
            path: `${apiConfig.authenticate.forgetPassword.path}?email=${params.email}`,
        };
        const result = yield call(sendRequest, options);

        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

const _resetPassword = ({ payload }: any) => {
    return processCallbackAction(apiConfig.authenticate.resetPassword, payload);
};

export default [
    takeLatest(GET_PROFILE, _getProfile),
    takeLatest(UPDATE_PROFILE, _updateProfile),
    takeLatest(LOG_IN, _logIn),
    takeLatest(LOGOUT, _logout),
    takeLatest(REGISTER, _register),
    takeLatest(CHANGE_PASSWORD, _changePassword),
    takeLatest(CHECK_ACCOUNT_EXIST, _checkAccountExist),
    takeLatest(FORGET_PASSWORD, _forgetPassword),
    takeLatest(RESET_PASSWORD, _resetPassword),
];
