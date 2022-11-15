import React, { useEffect, useState } from "react";

import OrderItemStatus from "./OrderItemStatus";

import FeeOrderStatus from "./FeeOrderStatus";

import classNames from "classnames";
import styles from "./index.module.scss";
import OrderItemComboStatus from "./OrderItemComboStatus";

const OrderLayout = ({ children, className, style, orderItems = [] }: any) => {
    const mergeProduct = (arrFilter: any) => {
        let arr: any[] = [];
        if (arrFilter !== undefined && arrFilter.length > 0) {
            const a = arrFilter.filter((e) => e.comboCode === arrFilter[0].comboCode);
            const b = arrFilter.filter((e) => e.comboCode !== arrFilter[0].comboCode);

            arr.push(a);

            if (b.length > 0) {
                return [a, ...mergeProduct(b)];
            } else {
                return arr;
            }
        } else {
            return [];
        }
    };

    const mergeCombo = (arr: any) => {
        let a: any[] = [];
        arr.forEach((item) => {
            let total = item.reduce(
                (prev, current) => prev + (current.price - current.discount) * current.quantity,
                0
            );
            a.push({
                name: item[0].comboName,
                code: item[0].comboCode,
                items: item,
                total: total,
            });
        });
        return a;
    };

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
                                    THÔNG TIN ĐƠN HÀNG ({orderItems?.items?.length})
                                </div>
                                <div className={styles.orderContent}>
                                    <div className={styles.listItem}>
                                        {orderItems?.items
                                            ?.filter((e) => e.comboCode === null)
                                            ?.map((item: any, index: number) => (
                                                <OrderItemStatus
                                                    key={index}
                                                    item={item}
                                                    style={"secondary"}
                                                />
                                            ))}
                                        {mergeCombo(
                                            mergeProduct(
                                                orderItems?.items?.filter(
                                                    (e) => e.comboCode !== null
                                                )
                                            )
                                        ).length > 0 &&
                                            mergeCombo(
                                                mergeProduct(
                                                    orderItems?.items?.filter(
                                                        (e) => e.comboCode !== null
                                                    )
                                                )
                                            ).map((item: any, index: number) => (
                                                <OrderItemComboStatus
                                                    key={index}
                                                    item={item}
                                                    style={"secondary"}
                                                />
                                            ))}
                                    </div>

                                    <FeeOrderStatus data={orderItems} style="secondary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderLayout;
