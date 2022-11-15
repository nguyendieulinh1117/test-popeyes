import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import {  paymentActionTypes } from "src/redux/actions";
import { createSuccessActionType } from '../helper'

const {
    GET_PAYMENT_METHOD
}: any = paymentActionTypes;

interface initialStateAddressType {
    paymentMethods: any,
}

const initialState: initialStateAddressType = {
    paymentMethods: [],
};

const payment = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.payment }
        },

        [createSuccessActionType(GET_PAYMENT_METHOD)]: (state: any, action: any) => {
            return {
                ...state,
                paymentMethods: action.payload.data || []
            };
        },

    },
    initialState
);

export default payment;