import {createAction} from "redux-actions";

export const actionTypes = {
    GET_DYNAMIC_CONTENT_BY_KEY: 'dynamic/GET_DYNAMIC_CONTENT_BY_KEY',
    GET_DYNAMIC_CONTENT_COMMON: 'dynamic/GET_DYNAMIC_CONTENT_COMMON',
}

export const actions = {
    getDynamicContentByKey: createAction(actionTypes.GET_DYNAMIC_CONTENT_BY_KEY),
    getDynamicContentCommon: createAction(actionTypes.GET_DYNAMIC_CONTENT_COMMON),
}