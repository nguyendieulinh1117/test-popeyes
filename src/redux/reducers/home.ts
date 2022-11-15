import { ContentType } from "@common/Models/ApiModels";
import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { homeActionTypes } from "src/redux/actions";
import { createSuccessActionType } from "../helper";

const {
    GET_ALL_COLLECTION,
    GET_LIST_BANNER,
    GET_LIST_BLOG,
    GET_BLOG_DETAIL,
    GET_COLLECTION_NEW,
    GET_COLLECTION_BEST_SELLER,
    GET_COLLECTION_HOUSE_WEAR,
} = homeActionTypes;
type stateType = {
    collections: any;
    banners: any;
    categories: any;
    blogs: any;
    blogDetail: ContentType;
    collectionNew: any;
    collectionBestSeller: any;
    collectionHouseWear: any;
};
const initialState: stateType = {
    collections: [],
    banners: [],
    categories: [],
    blogs: [],
    blogDetail: {},
    collectionNew: {},
    collectionBestSeller:{},
    collectionHouseWear: {},
};

const home = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.home };
        },
        [createSuccessActionType(GET_ALL_COLLECTION)]: (state: any, action: any) => {
            return {
                ...state,
                collections: action.payload.data.items || [],
            };
        },
        [createSuccessActionType(GET_LIST_BANNER)]: (state: any, action: any) => {
            return {
                ...state,
                banners: action.payload.data.items || [],
            };
        },
        [createSuccessActionType(GET_LIST_BLOG)]: (state: any, action: any) => {
            return {
                ...state,
                blogs: action.payload.data.items || [],
            };
        },
        [createSuccessActionType(GET_BLOG_DETAIL)]: (state: any, action: any) => {
            return {
                ...state,
                blogDetail: action.payload.data || {},
            };
        },
        [createSuccessActionType(GET_COLLECTION_HOUSE_WEAR)]: (state: any, action: any) => {
            return {
                ...state,
                collectionHouseWear: action.payload.data || {},
            };
        },
        [createSuccessActionType(GET_COLLECTION_NEW)]: (state: any, action: any) => {
            return {
                ...state,
                collectionNew: action.payload.data || {},
            };
        },
        [createSuccessActionType(GET_COLLECTION_BEST_SELLER)]: (state: any, action: any) => {
            return {
                ...state,
                collectionBestSeller: action.payload.data || {},
            };
        },
        
    },
    initialState
);

export default home;
