import { createAction } from 'redux-actions';

export const actionTypes = {
    START_LOADING: 'loading/START_LOADING',
    FINISH_LOADING: 'loading/FINISH_LOADING',
}

export const actions = {
    startLoading: createAction(actionTypes.START_LOADING, (requestType: any) => requestType),
    finishLoading: createAction(actionTypes.FINISH_LOADING, (requestType: any) => requestType),
}

