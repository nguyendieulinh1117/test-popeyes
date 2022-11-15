import React, { useMemo } from "react";
import { useRouter } from "next/router";

import classNames from "classnames";
import styles from "./Payment.module.scss";
import Button from "@@@Form/Button";
import Contact from "./Contact";
import { paths } from "@constants";
import { formatPrice } from "@utils";
import { renderDiscount } from "@utils/discount";

const Payment = ({ data }: any) => {
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
        <div className={styles.payment}>
            <div className={styles.paymentWrap}>
                <div className={styles.paymentMain}>
                    <div className={styles.subTotal}>
                        <p>TỔNG THANH TOÁN</p>
                        <span>{formatPrice(renderTotal)}</span>
                    </div>
                    <div className={styles.btnWrap}>
                        <Button
                            className={styles.btn}
                            buttonStyle="secondary"
                            onClick={() => router.push(paths.checkout)}
                        >
                            Thanh toán
                        </Button>
                        <Button className={styles.btn} onClick={() => router.back()}>
                            Tiếp tục mua hàng
                        </Button>
                    </div>
                </div>
                <Contact cart={false} />
            </div>
        </div>
    );
};

export default Payment;
