import { HYDRATE } from "next-redux-wrapper";
import { handleActions } from "redux-actions";

import { deliveryActionTypes } from "src/redux/actions";
import { createFailureActionType, createSuccessActionType } from '../helper'


const {
    DELIVERY_CALCULATE_FEE,
}:any = deliveryActionTypes;

interface initialStateAddressType {
    deliveryFee: number,
    deliveryFeeErr: boolean,
}

const initialState: initialStateAddressType = {
    deliveryFee: 0,
    deliveryFeeErr: false,
};

const delivery = handleActions(
    {
        [HYDRATE]: (state, action: any) => {
            return { ...state, ...action.payload.delivery }
        },

        [createSuccessActionType(DELIVERY_CALCULATE_FEE)]: (state: any, action: any) => {
            return {
                ...state,
                deliveryFee: action.payload.deliveryFee || 0,
                deliveryFeeErr: false
            };
        },
        [createFailureActionType(DELIVERY_CALCULATE_FEE)]: (state: any, action: any) => {
            return {
                ...state,
                deliveryFee: action.payload.deliveryFee || 0,
                deliveryFeeErr: true
            };
        },
    },
    initialState
);

export default delivery;