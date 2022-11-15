import { createAction } from "redux-actions";

export const actionTypes = {
    GET_ALL_COLLECTION: "home/GET_ALL_COLLECTION",
    GET_LIST_BANNER: "home/GET_LIST_BANNER",
    GET_LIST_BLOG: "home/GET_LIST_BLOG",
    GET_BLOG_DETAIL: "home/GET_BLOG_DETAIL",
    GET_COLLECTION_BY_TAG: "home/GET_COLLECTION_BY_TAG",
    GET_PROD: "home/GET_PROD",
    GET_COLLECTION_NEW: "home/GET_COLLECTION_NEW",
    GET_COLLECTION_BEST_SELLER: "home/GET_COLLECTION_BEST_SELLER",
    GET_COLLECTION_HOUSE_WEAR: "home/GET_COLLECTION_HOUSE_WEAR",
};

export const actions = {
    getAllCollection: createAction(actionTypes.GET_ALL_COLLECTION),
    getListBanner: createAction(actionTypes.GET_LIST_BANNER),
    getListBlog: createAction(actionTypes.GET_LIST_BLOG),
    getBlogDetail: createAction(actionTypes.GET_BLOG_DETAIL),
    getCollectionByTag: createAction(actionTypes.GET_COLLECTION_BY_TAG),
    getProd: createAction(actionTypes.GET_PROD),
    getCollectionNew: createAction(actionTypes.GET_COLLECTION_NEW),
    getCollectionBestSeller: createAction(actionTypes.GET_COLLECTION_BEST_SELLER),
    getCollectionHouseWear: createAction(actionTypes.GET_COLLECTION_HOUSE_WEAR),
};
