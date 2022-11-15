import CheckoutPage from "@@Checkout";
import Notfound404 from "@hocs/Notfound404";
import useAuth from "@hooks/useAuth";
import useBasketCheckOut from "@hooks/useBasketCheckOut";
import { addressActions, authActions, paymentActions, storeActions } from "@redux/actions";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Checkout = () => {
    const dispatch = useDispatch();
    const {isAuthenticated} = useAuth();
    const {basketId} = useBasketCheckOut();
    const [ isFound, setIsFound ] = useState<boolean>(true)

    useEffect(()=>{
        if(!basketId){
            setIsFound(false)
            return;
        }
        dispatch(storeActions.getProvinces());
        dispatch(paymentActions.getPaymentMethod());
        if(isAuthenticated){
            dispatch(authActions.getProfile());
            dispatch(addressActions.getAddress());
        }
    },[])
    return (
        <Notfound404 condition={isFound}>
            <CheckoutPage />
        </Notfound404>
    );
};

export default Checkout;
