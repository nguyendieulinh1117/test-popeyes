import React, { useEffect } from "react";
import { useSelectorTyped } from "@hooks/useSelectorType";

import MainCart from "./MainCart";
import Breadcrumbs from "@@@Breadcrumbs";
import EmptyCart from "./EmptyCart";

import styles from "./index.module.scss";
import { isEmptyObject } from "@utils";
import { viewCartFunc } from "@utils/measureEcommerceGA";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },

    {
        label: "Giỏ hàng",
        active: true,
    },
];
const Cart = () => {
    const { basketData } = useSelectorTyped((state) => state.basket);
    useEffect(()=>{
        if(basketData){
            viewCartFunc(basketData)
        }
    }, [])
    return (
        <div className={styles.cartPage}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className={styles.cart}>
                <div className={styles.container}>
                    {isEmptyObject(basketData) || (basketData?.products?.length <= 0 && basketData?.combos?.length <= 0) ? (
                        <EmptyCart />
                    ) : (
                        <MainCart basketData={basketData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
