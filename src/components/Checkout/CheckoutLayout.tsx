import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { paths } from "@constants";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { useDispatch } from "react-redux";
import { basketActions } from "@redux/actions";
import useBasketCheckOut from "@hooks/useBasketCheckOut";

import { Desktop } from "@@@Media";

import IconArrowLeft from "@assets/icons/arrow-left.svg";

import Contact from "@@Cart/Contact";
import VoucherForm from "@@@OrderLayout/VoucherForm";
import Fee from "@@@OrderLayout/Fee";
import OrderItem from "@@@OrderLayout/OrderItem";

import classNames from "classnames";
import styles from "./CheckoutLayout.module.scss";
import OrderItemCombo from "@components/Common/OrderLayout/OrderItemCombo";

const CheckoutLayout = ({ children, className, style }: any) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { basketId } = useBasketCheckOut();

    const { basketData } = useSelectorTyped((state) => state.basket);
    const [basketBuyNowData, setBasketBuyNowData] = useState<any>(null);
    const [promotion, setPromotion] = useState<any>({});

    // useEffect(() => {
    //     if (basketId) {
    //         dispatch(
    //             basketActions.getBasketBuyNow({
    //                 params: basketId,
    //                 onCompleted: (res: any) => {
    //                     if (res?.success) {
    //                         setBasketBuyNowData(res?.data);
    //                     }
    //                 },
    //                 onError: (err: any) => {
    //                 },
    //             })
    //         );
    //     }
    // }, [basketId]);

    return (
        <div className={styles.order}>
            <div className={styles.container}>
                <div className={classNames(styles.orderLayout, styles[style] || styles.primary)}>
                    <div
                        className={classNames(
                            styles.orderStatus,
                            styles[style] || styles.primary,
                            className
                        )}
                    >
                        {children}
                    </div>
                    <div
                        className={classNames(
                            styles.orderInfo,
                            styles[style] || styles.primary,
                            className
                        )}
                    >
                        <div className={styles.orderWrap}>
                            <div className={styles.main}>
                                <div className={styles.orderTitle}>
                                    THÔNG TIN ĐƠN HÀNG ({basketData?.products?.length})
                                </div>
                                <div className={styles.orderContent}>
                                    <div className={styles.listItem}>
                                        {basketData?.combos?.map((item: any, index: number) => (
                                            <OrderItemCombo
                                                key={index}
                                                index={index}
                                                data={item}
                                                style={"primary"}
                                                basketData={basketData}
                                            />
                                        ))}
                                        {basketData?.products?.map((item: any, index: number) => (
                                            <OrderItem
                                                key={index}
                                                index={index}
                                                data={item}
                                                style={"primary"}
                                                productDiscounts={promotion?.productDiscounts}
                                                basketData={basketData}
                                            />
                                        ))}
                                        {basketData?.bonusProducts?.length > 0 &&
                                            basketData?.bonusProducts?.map(
                                                (item: any, index: number) => (
                                                    <OrderItem
                                                        key={index}
                                                        index={index}
                                                        data={item}
                                                        style={"primary"}
                                                        type="gift"
                                                    />
                                                )
                                            )}
                                    </div>
                                    <VoucherForm
                                        promotion={promotion}
                                        setPromotion={setPromotion}
                                        basketData={basketData}
                                    />

                                    <Fee data={basketData} style="primary" promotion={promotion} />

                                    <Desktop>
                                        <div
                                            className={styles.back}
                                            onClick={() => router.push(paths.cart)}
                                        >
                                            <IconArrowLeft />
                                            <span>Quay về giỏ hàng</span>
                                        </div>
                                    </Desktop>
                                </div>
                            </div>
                            <Contact cart={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutLayout;
