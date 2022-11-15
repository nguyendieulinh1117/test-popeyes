import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Mobile } from "../Media";
import IconArrowLeft from "@assets/icons/arrow-left.svg";
import styles from "./Fee.module.scss";
import { useRouter } from "next/router";
import { paths, storageKeys } from "@constants";
import { formatPrice } from "@utils";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { renderDiscount } from "@utils/discount";
import { getObjectData } from "@utils/sessionStorage";

const Fee = ({ data, className, style = "primary", promotion }: any) => {
    const router = useRouter();
    const { basketData } = useSelectorTyped((state) => state.basket);
    const { deliveryFee } = useSelectorTyped((state) => state.delivery);
    const [promotionDiscount, setPromotionDiscount] = useState(0);

    useEffect(() => {
        let productDiscount = 0;
        getObjectData(storageKeys.PROMOTION)?.productDiscounts?.forEach((product) => {
            productDiscount = productDiscount + product.discount;
        });
        let totalDiscountPromotion =
            (getObjectData(storageKeys.PROMOTION)?.discount || 0) + productDiscount;
        setPromotionDiscount(totalDiscountPromotion);
    }, [getObjectData(storageKeys.PROMOTION)]);

    const renderTotal = useMemo(() => {
        const basketTotal = basketData?.totalPrice;
        const basketDiscount = basketData?.totalDiscount;

        let total = 0;

        basketData?.products?.forEach((item) => {
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
    }, [basketData]);

    return (
        <div className={classNames(styles.fee, styles[style] || styles.primary, className)}>
            <div className={styles.feeList}>
                <div className={styles.feeItem}>
                    <p>Tạm tính</p>
                    <span>{formatPrice(renderTotal || 0)}</span>
                </div>
                <div className={styles.feeItem}>
                    <p>Phí vận chuyển</p>
                    <span>{formatPrice(deliveryFee || 0)}</span>
                </div>
                <div className={styles.feeItem}>
                    <p>Giảm khuyến mãi</p>
                    <span>{formatPrice(promotionDiscount || 0)}</span>
                </div>
            </div>
            <div className={styles.feeTotal}>
                <p>Tổng thanh toán</p>
                <span>
                    {renderTotal + deliveryFee - promotionDiscount > 0
                        ? formatPrice(renderTotal + deliveryFee - promotionDiscount || 0)
                        : formatPrice(0)}
                </span>
            </div>
            <Mobile>
                <div className={styles.back} onClick={() => router.push(paths.cart)}>
                    <IconArrowLeft />
                    <span>Quay về giỏ hàng</span>
                </div>
            </Mobile>
        </div>
    );
};

export default Fee;
