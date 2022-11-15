import {call, takeLatest} from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import {productActionTypes} from "src/redux/actions";
import {processCallbackAction, processLoadingAction} from "../helper";
import {RequestApi} from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {GET_COLLECTION_BY_ID, GET_ALL_MODEL, CREATE_COLLECTION, 
    GET_PRODUCT_DETAIL_BY_SLUG, GET_PRODUCTS, GET_COMBO_DETAIL,
    SEARCH_PRODUCTS, GET_PRODUCT_DETAIL_BY_SLUG_LOADING} = productActionTypes;

const getCollectionById = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.collection.getAllCollection, payload);
}

const getAllModel = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.model.getAllModel, payload);
}

const createCollection = ({payload}: RequestApi<any>) => {
    return processCallbackAction(apiConfig.collection.createCollection, payload);
}

function* _getProductDetailBySlug({payload}: RequestApi<any>): any{
    const {params, onCompleted, onError} = payload;

    try {
        const options = {
            ...apiConfig.product.getProductSlug,
            path: `${apiConfig.product.getProductSlug.path}/${params.slug}`
        }

        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

const _getProducts = ({payload}: RequestApi<any>) => {
    payload.params.is_active = true;
    if(payload.params?.size) {
        const paramArray: Array<string> = payload.params.size.split(",");
        const paramSize =paramArray.filter(e=>e !== "Free Size").map(e => `"${e}"`).join(' ');
        if(paramArray.length ===1 && paramArray[0] === "Free Size"){
            payload.params.query =`(${payload.params.query?payload.params.query + ' AND ':''}optionGroups.groupType:1 AND optionGroups.options.name: "Free Size")`;
        }else {
            payload.params.query =`(${payload.params.query?payload.params.query + ' AND ':''}optionGroups.groupType:1 AND (optionGroups.options.name: ${paramSize} OR optionGroups.options.name:"Free Size"))`;
        }
    }
    let payloadParams = payload;
    delete payloadParams.params.size;
    return processCallbackAction(apiConfig.product.getProductSlug, payloadParams);
}

const _searchProducts = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.product.getProductSlug, payload);
}

function* _getComboDetail({payload}: RequestApi<any>): any{
    const {params, onCompleted, onError} = payload;

    try {
        const options = {
            ...apiConfig.combos.getComboDetail,
            path: `${apiConfig.combos.getComboDetail.path}/${params.id}`
        }

        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError)
    } catch (error) {
        onError(error)
    }
} 

const _getProductBySlug = (payload: RequestApi<any>) => {
    const options = {
        ...apiConfig.product.getProductSlug,
        path: `${apiConfig.product.getProductSlug.path}/${payload.payload.slug}`
    }
    return processLoadingAction(options, payload);
}

export default [
    takeLatest(GET_COLLECTION_BY_ID, getCollectionById),
    takeLatest(GET_ALL_MODEL, getAllModel),
    takeLatest(CREATE_COLLECTION, createCollection),
    takeLatest(GET_PRODUCT_DETAIL_BY_SLUG, _getProductDetailBySlug),
    takeLatest(GET_PRODUCTS, _getProducts),
    takeLatest(SEARCH_PRODUCTS, _searchProducts),
    takeLatest(GET_COMBO_DETAIL, _getComboDetail),
    takeLatest(GET_PRODUCT_DETAIL_BY_SLUG_LOADING, _getProductBySlug),
]