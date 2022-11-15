import {call, takeLatest} from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import {categoriesActionTypes} from "src/redux/actions";
import {processCallbackAction, processLoadingAction} from "../helper";
import {RequestApi} from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const {GET_LIST_CATEGORIES, GET_CATEGORIES_SLUG, GET_PRODUCT_FILTER} = categoriesActionTypes;

const _getListCategories = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.product.getCategories, payload);
}

function* _getCategoriesSlug({payload}: RequestApi<any>): any{
    const {params, onCompleted, onError} = payload;

    try {
        const options = {
            ...apiConfig.product.getCategories,
            path: `${apiConfig.product.getCategories.path}/${params.slug}`
        }
        const result = yield call(sendRequest, options);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

const _getProductFilter = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.product.getProductFilter, payload);
}

export default [
    takeLatest(GET_LIST_CATEGORIES, _getListCategories),
    takeLatest(GET_CATEGORIES_SLUG, _getCategoriesSlug),
    takeLatest(GET_PRODUCT_FILTER, _getProductFilter),
]