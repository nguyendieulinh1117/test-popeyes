import React from "react";

import { formatPrice } from "@utils";

import classNames from "classnames";
import styles from "./Fee.module.scss";

const FeeOrderStatus = ({ data, className, style = "primary" }: any) => {
    const shippingFee = data?.shipping?.estimatedAmount || 0;
    const voucher = data?.voucher?.amount || 0;
    const discountFee = () => {
        let total = 0;
        data?.items?.map((product: any) => {
            total += product?.discount;
        });
        return total;
    };
    const totalPriceTemp = () => {
        let total = 0;
        data?.items?.map((product: any) => {
            total += (product?.price - product?.discount) * product?.quantity;
        });
        return total;
    };
    return (
        <div className={classNames(styles.fee, styles[style] || styles.primary, className)}>
            <div className={styles.feeList}>
                <div className={styles.feeItem}>
                    <p>Tạm tính</p>
                    <span>{formatPrice(totalPriceTemp() || 0)}</span>
                </div>
                <div className={styles.feeItem}>
                    <p>Phí vận chuyển</p>
                    <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className={styles.feeItem}>
                    <p>Giảm khuyến mãi</p>
                    <span>{formatPrice(voucher || 0)}</span>
                </div>
            </div>

            <div className={styles.feeTotal}>
                <p>Tổng thanh toán</p>
                <span>
                    {data?.payment?.amount > 0
                        ? formatPrice(data?.payment?.amount || 0)
                        : formatPrice(0)}
                </span>
            </div>
        </div>
    );
};

export default FeeOrderStatus;
