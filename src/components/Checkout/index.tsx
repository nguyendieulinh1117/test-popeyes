import React from "react";
import CheckOutForm from "./CheckOutForm";
import useAuth from "@hooks/useAuth";

import ClientSideRender from "@hocs/ClientSideRender";
import CheckoutLayout from "./CheckoutLayout";
import { deliveryActionTypes, promotionActionTypes } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import Loading from "@components/Common/Loading";

const Checkout = () => {
    const { isAuthenticated, user } = useAuth();
    const { [deliveryActionTypes.DELIVERY_CALCULATE_FEE]: loadingDeliveryFee }: any =
        useSelectorTyped((state) => state.loading);
    const { [promotionActionTypes.PROMOTION_CHECK]: loadingCheckPromotion }: any = useSelectorTyped(
        (state) => state.loading
    );

    return (
        <ClientSideRender>
            <CheckoutLayout>
                <CheckOutForm user={user} isAuthenticated={isAuthenticated} />
            </CheckoutLayout>
            <Loading active={loadingDeliveryFee || loadingCheckPromotion} />
        </ClientSideRender>
    );
};

export default Checkout;
