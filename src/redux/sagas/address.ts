import { call, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { addressActionTypes } from "src/redux/actions";
import { processCallbackAction, processLoadingAction } from "@redux/helper";
import { RequestApi } from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {
    GET_ADDRESS,
    ADD_ADDRESS,
    UPDATE_ADDRESS,
    DELETE_ADDRESS,
} = addressActionTypes;

const _getAddress = (payload: any) => {
    return processLoadingAction(apiConfig.address.getAddress, payload);
}

const _addAddress = ({ payload }: any) => {
    return processCallbackAction(apiConfig.address.addAddress, payload);
}

function* _updateAddress({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {
    try {
        const options = {
            ...apiConfig.address.updateAddress,
            path: `${apiConfig.address.updateAddress.path}/${params.id}`
        }
        const result = yield call(sendRequest, options, params);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

function* _deleteAddress({ payload: { params, onCompleted, onError } }: RequestApi<any>): any {

    try {
        const options = {
            ...apiConfig.address.deleteAddress,
            path: `${apiConfig.address.deleteAddress.path}/${params.id}`
        }
        const result = yield call(sendRequest, options, params);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

export default [
    takeLatest(GET_ADDRESS, _getAddress),
    takeLatest(ADD_ADDRESS, _addAddress),
    takeLatest(UPDATE_ADDRESS, _updateAddress),
    takeLatest(DELETE_ADDRESS, _deleteAddress),
];

