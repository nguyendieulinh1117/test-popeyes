import { call, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { dynamicActionTypes } from "src/redux/actions";
import {
    processLoadingAction,
} from "../helper";
import { RequestApi } from "@common/Models/ApiModels";

const {
    GET_DYNAMIC_CONTENT_BY_KEY,
    GET_DYNAMIC_CONTENT_COMMON
} = dynamicActionTypes;

const _getDynamicContentByKey = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.dynamicContent.getDynamicContentByKey, payload);
};

export default [
    takeLatest(GET_DYNAMIC_CONTENT_BY_KEY, _getDynamicContentByKey),
    takeLatest(GET_DYNAMIC_CONTENT_COMMON, _getDynamicContentByKey),
];
