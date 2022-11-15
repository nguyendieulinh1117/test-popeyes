import React, { useMemo } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import Button from "@@@Form/Button";
import CartItem from "./CartItem";

import styles from "./List.module.scss";
import { formatPrice } from "@utils";
import { paths } from "@constants";
import CartItemCombo from "./CartItemCombo";
import { renderDiscount } from "@utils/discount";

const List = ({ data, isAuth }: any) => {
    const router = useRouter();
    const renderTotal = useMemo(() => {
        const basketTotal = data?.totalPrice;
        const basketDiscount = data?.totalDiscount;

        let total = 0;

        data?.products?.forEach((item) => {
            let salePrice = item?.price;

            let quantity = item.quantity;

            if (item?.promotion) {
                let dis = renderDiscount(
                    salePrice,
                    item?.promotion?.discount,
                    item?.promotion?.maxDiscount,
                    item?.promotion?.discountPercentage,
                    item?.promotion?.fixedPrice
                );
                total += dis * quantity;
            }
        });

        return basketTotal - basketDiscount - total;
    }, [data]);
    return (
        <div className={classNames(styles.list, { [styles.secondary]: !isAuth })}>
            <div className={styles.listItem}>
                {data?.combos?.map((item: any, index: number) => (
                    <CartItemCombo item={item} key={index} index={index} />
                ))}
                {data?.products?.map((item: any, index: number) => (
                    <CartItem item={item} key={index} index={index} />
                ))}
                {data?.bonusProducts?.length > 0 &&
                    data?.bonusProducts?.map((item: any, index: number) => (
                        <CartItem item={item} key={index} index={index} type="gift" />
                    ))}
            </div>
            <div className={styles.payment}>
                <div className={styles.total}>
                    <h4>Tổng thanh toán:</h4>
                    <span>{formatPrice(renderTotal)}</span>
                </div>
                <Button
                    className={styles.btn}
                    buttonStyle="secondary"
                    onClick={() => router.push(paths.cart)}
                >
                    Xem giỏ hàng
                </Button>
            </div>
        </div>
    );
};

export default List;
