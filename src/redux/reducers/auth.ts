import { storageKeys } from "@constants";
import { setObjectData } from "@utils/localStorage";
import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { authActionTypes } from "src/redux/actions";
import { createSuccessActionType } from '../helper'

const {
    GET_PROFILE,
    LOG_IN,
}: any = authActionTypes;

interface initialStateAuthType {
    profile: any,
    login: any,
    userData: any,
}

const initialState: initialStateAuthType = {
    profile: {},
    login: {},
    userData: {},
};

const auth = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.auth }
        },
        [GET_PROFILE]: (state: any, action: any) => {
            return {
                ...state,
                profile: action.payload || {}
            };
        },
        [createSuccessActionType(GET_PROFILE)]: (state: any, action: any) => {
            return {
                ...state,
                profile: action.payload || {}
            };
        },
        [LOG_IN]: (state: any, action: any) => {
            return {
                ...state,
                login: action.payload || {}
            };
        },
    },
    initialState
);

export default auth;