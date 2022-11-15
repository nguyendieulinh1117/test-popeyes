import { call, delay, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { homeActionTypes, loadingActions } from "src/redux/actions";
import {
    createFailureActionType,
    createSuccessActionType,
    processCallbackAction,
    processLoadingAction,
} from "../helper";
import { RequestApi } from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {
    GET_ALL_COLLECTION,
    GET_LIST_BANNER,
    GET_LIST_BLOG,
    GET_BLOG_DETAIL,
    GET_COLLECTION_BY_TAG,
    GET_PROD,
    GET_COLLECTION_HOUSE_WEAR,
    GET_COLLECTION_NEW,
    GET_COLLECTION_BEST_SELLER
} = homeActionTypes;

const getAllCollection = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.collection.getAllCollection, payload);
};

const getListBanner = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.banner.getListBanner, payload);
};

const getListBlog = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.content.getListContent, payload);
};

function* getBlogDetail({ payload }: RequestApi<any>): any {
    const SUCCESS = createSuccessActionType(GET_BLOG_DETAIL);
    const FAILURE = createFailureActionType(GET_BLOG_DETAIL);

    const options = {
        ...apiConfig.content.getListContent,
        path: `${apiConfig.content.getListContent.path}/${payload}`,
    };
    try {
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

function* getCollectionByTag({ payload: {tag, onCompleted, onError} }: RequestApi<any>): any{
    const options = {
        ...apiConfig.collection.getAllCollection,
        path: `${apiConfig.collection.getAllCollection.path}/${tag}`,
    };
    
    try {
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
};

function* getProdFilter({ payload }: any): any {
    const { id, onSuccess, onFailure } = payload;
    const options = {
        ...apiConfig.collection.getProdDetail,
        path: `${apiConfig.collection.getProdDetail.path}/${id}/options`,
    };
    try {
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onSuccess, onFailure);
    } catch (error) {
        onFailure(error);
    }
}

function* getCollectionById(payload: RequestApi<any>): any {
    
    const SUCCESS = createSuccessActionType(payload.type);
    const FAILURE = createFailureActionType(payload.type);

    const options = {
        ...apiConfig.collection.getAllCollection,
        path: `${apiConfig.collection.getAllCollection.path}/${payload.payload}`,
    };
    yield put(loadingActions.startLoading(payload.type));
    try {
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
    } finally {
        yield put(loadingActions.finishLoading(payload.type));
    }
}

function* getCollectionByIdCallBack({payload}: RequestApi<any>): any {

    const { id, onCompleted, onError} = payload

    const options = {
        ...apiConfig.collection.getAllCollection,
        path: `${apiConfig.collection.getAllCollection.path}/${id}`,
    };
    
    try {
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

export default [
    takeLatest(GET_ALL_COLLECTION, getAllCollection),
    takeLatest(GET_LIST_BANNER, getListBanner),
    takeLatest(GET_LIST_BLOG, getListBlog),
    takeLatest(GET_BLOG_DETAIL, getBlogDetail),
    takeLatest(GET_COLLECTION_BY_TAG, getCollectionByTag),
    takeLatest(GET_PROD, getProdFilter),
    takeLatest(GET_COLLECTION_NEW, getCollectionById),
    takeLatest(GET_COLLECTION_BEST_SELLER, getCollectionById),
    takeLatest(GET_COLLECTION_HOUSE_WEAR, getCollectionByIdCallBack),
];
