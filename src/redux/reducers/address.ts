import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { addressActionTypes } from "src/redux/actions";
import { createSuccessActionType } from '../helper'

const {
    GET_ADDRESS,
}: any = addressActionTypes;

interface initialStateAddressType {
    addressBooks: any,
}

const initialState: initialStateAddressType = {
    addressBooks: [],
};

const address = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.address }
        },

        [createSuccessActionType(GET_ADDRESS)]: (state: any, action: any) => {
            return {
                ...state,
                addressBooks: action.payload.data || []
            };
        },

    },
    initialState
);

export default address;