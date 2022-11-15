import {getStringData} from "@utils/localStorage";
import {storageKeys} from "@constants";
import { useRouter } from "next/router";

const useBasketCheckOut = () => {
    const {query} = useRouter()
    const basketId = query.basketId ?? getStringData(storageKeys.BASKET_ID);
    return {
        basketId: basketId,
        isBasket: !!basketId
    }
}

export default useBasketCheckOut;