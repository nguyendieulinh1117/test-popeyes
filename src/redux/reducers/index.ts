import { combineReducers } from "redux";

import home from "./home";
import product from "./product";
import loading from "./loading";
import auth from "./auth";
import store from "./store";
import categories from "./categories";
import dynamic from "./dynamic";
import address from "./address";
import basket from "./basket";
import payment from "./payment";
import order from "./order";
import delivery from "./delivery";


const rootReducer = combineReducers({
    loading,
    home,
    product,
    auth,
    store,
    categories,
    dynamic,
    address,
    basket,
    payment,
    order,
    delivery
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;