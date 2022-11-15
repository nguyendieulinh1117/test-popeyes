import React from "react";
import classNames from "classnames";
import styles from "./OrderItem.module.scss";
import CachedImage from "../CachedImage";
import { formatPrice } from "@utils";

const OrderItemStatus = ({ className, style = "primary", item }: any) => {
    const priceProduct = formatPrice(item?.price - item?.discount);
    return (
        <div className={classNames(styles.orderItem, styles[style] || styles.primary, className)}>
            <div className={styles.orderImage}>
                <div className={styles.image}>
                    <CachedImage src={item?.imageUrl} />
                </div>
                <div className={styles.badge}>{item?.quantity}</div>
            </div>
            <div className={styles.orderMain}>
                <div className={styles.orderInfo}>
                    <div className={styles.name}>
                        {item?.source === "Promotion" && "QUÀ TẶNG - "}
                        {item?.name}
                    </div>
                    {
                        <div className={styles.price}>
                            {priceProduct}
                            {item?.discount > 0 && (
                                <span className={styles.delPrice}>{formatPrice(item?.price)}</span>
                            )}
                        </div>
                    }
                    {item?.source !== "Promotion" && item?.description && (
                        <div className={styles.option}>{item?.description}</div>
                    )}
                    {item?.comboName && (
                        <div className={styles.comboDes}>Mua theo combo {item?.comboName}</div>
                    )}
                </div>
                <div className={styles.orderTotal}>
                    <div className={styles.total}>
                        <p>Tổng cộng:</p>
                        <span>{formatPrice((item?.price - item?.discount) * item?.quantity)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItemStatus;
