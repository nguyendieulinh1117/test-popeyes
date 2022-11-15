import { all } from "redux-saga/effects";

import home from "./home";
import product from "./product";
import auth from "./auth";
import store from "./store";
import categories from "./categories";
import dynamic from "./dynamic";
import address from "./address";
import basket from "./basket";
import order from "./order";
import payment from "./payment";
import promotion from "./promotion";
import delivery from "./delivery";

const sagas = [
    ...home,
    ...product,
    ...auth,
    ...store,
    ...categories,
    ...dynamic,
    ...address,
    ...basket,
    ...order,
    ...promotion,
    ...payment,
    ...promotion,
    ...delivery,
];

function* rootSaga() {
    yield all(sagas);
}

export default rootSaga;