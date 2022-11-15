import { createAction } from 'redux-actions';

export const actionTypes = {
    GET_ADDRESS: 'address/GET_ADDRESS',
    SET_ADDRESS: 'address/SET_ADDRESS',
    ADD_ADDRESS: 'address/ADD_ADDRESS',
    UPDATE_ADDRESS: 'address/UPDATE_ADDRESS',
    DELETE_ADDRESS: 'address/DELETE_ADDRESS',
}

export const actions = {
    getAddress: createAction(actionTypes.GET_ADDRESS),
    setAddress: createAction(actionTypes.SET_ADDRESS),
    addAddress: createAction(actionTypes.ADD_ADDRESS),
    updateAddress: createAction(actionTypes.UPDATE_ADDRESS),
    deleteAddress: createAction(actionTypes.DELETE_ADDRESS),
}