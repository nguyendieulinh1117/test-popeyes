import { createAction } from "redux-actions";

export const actionTypes = {
    GET_BASKET: "basket/GET_BASKET",
    CREATE_BASKET: "basket/CREATE_BASKET",
    UPDATE_BASKET: "basket/UPDATE_BASKET",
    DELETE_BASKET: "basket/DELETE_BASKET",
    GET_BASKET_BUY_NOW: "basket/GET_BASKET_BUY_NOW",
    CLEAR_DATA_BASKET: "basket/CLEAR_DATA_BASKET",
    CHECK_STOCK_BASKET: "basket/CHECK_STOCK_BASKET",
    CHECK_STOCK: "basket/CHECK_STOCK",
};

export const actions = {
    getBasket: createAction(actionTypes.GET_BASKET),
    createBasket: createAction(actionTypes.CREATE_BASKET),
    updateBasket: createAction(actionTypes.UPDATE_BASKET),
    deleteBasket: createAction(actionTypes.DELETE_BASKET),
    getBasketBuyNow: createAction(actionTypes.GET_BASKET_BUY_NOW),
    clearDataBasket: createAction(actionTypes.CLEAR_DATA_BASKET),
    checkStockBasket: createAction(actionTypes.CHECK_STOCK_BASKET),
    checkStock: createAction(actionTypes.CHECK_STOCK)
};
