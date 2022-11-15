import { createAction } from 'redux-actions';

export const actionTypes = {
    GET_PROFILE: 'auth/GET_PROFILE',
    UPDATE_PROFILE: 'auth/UPDATE_PROFILE',
    LOG_IN: 'auth/LOG_IN',
    LOGOUT: 'auth/LOGOUT',
    REGISTER: 'auth/REGISTER',
    CHANGE_PASSWORD: 'auth/CHANGE_PASSWORD',
    SET_PROFILE: 'auth/SET_PROFILE',
    CHECK_ACCOUNT_EXIST: 'auth/CHECK_ACCOUNT_EXIST',
    FORGET_PASSWORD: 'auth/FORGET_PASSWORD',
    RESET_PASSWORD: 'auth/RESET_PASSWORD',
}

export const actions = {
    getProfile: createAction(actionTypes.GET_PROFILE),
    updateProfile: createAction(actionTypes.UPDATE_PROFILE),
    logIn: createAction(actionTypes.LOG_IN),
    logout: createAction(actionTypes.LOGOUT),
    register: createAction(actionTypes.REGISTER),
    changePassword: createAction(actionTypes.CHANGE_PASSWORD),
    setProfile: createAction(actionTypes.SET_PROFILE),
    checkAccountExist: createAction(actionTypes.CHECK_ACCOUNT_EXIST),
    forgetPassword: createAction(actionTypes.FORGET_PASSWORD),
    resetPassword: createAction(actionTypes.RESET_PASSWORD),
}