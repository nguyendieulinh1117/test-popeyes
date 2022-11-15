import {call, takeLatest} from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import {storeActionTypes} from "src/redux/actions";
import {processLoadingAction} from "../helper";
import {RequestApi} from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {GET_STORES, GET_PROVINCES, GET_PROVINCE_DETAIL, GET_TOTAL_STORES} = storeActionTypes;

const _getStores = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.stores.getStores, payload);
}

const _getProvinces = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.stores.getProvinces, payload);
}

function* _getProvinceDetail  ({payload}: any):any {
    
    const {params, onCompleted, onError} = payload;
    
    try {
        const options = {
            ...apiConfig.stores.getProvinceDetail,
            path: `${apiConfig.stores.getProvinceDetail.path}/${params.id}`
        }
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

export default [
    takeLatest(GET_STORES, _getStores),
    takeLatest(GET_PROVINCES, _getProvinces),
    takeLatest(GET_PROVINCE_DETAIL, _getProvinceDetail),
    takeLatest(GET_TOTAL_STORES, _getStores),

];