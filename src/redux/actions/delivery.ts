import { createAction } from 'redux-actions';

export const actionTypes = {
    DELIVERY_CALCULATE_FEE: 'delivery/DELIVERY_CALCULATE_FEE',
    DELIVERY_SERVICES: 'delivery/DELIVERY_SERVICES',
    DELIVERY: 'delivery/DELIVERY',
    
}

export const actions = {
    deliveryCalculateFee: createAction(actionTypes.DELIVERY_CALCULATE_FEE),
    deliveryServices: createAction(actionTypes.DELIVERY_SERVICES),
    delivery: createAction(actionTypes.DELIVERY),
}