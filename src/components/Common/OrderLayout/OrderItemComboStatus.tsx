import React from "react";
import classNames from "classnames";
import styles from "./OrderItem.module.scss";
import CachedImage from "../CachedImage";
import { formatPrice } from "@utils";

const OrderItemComboStatus = ({ className, style = "primary", item }: any) => {
    return (
        <div className={styles.orderCombo}>
            <div className={styles.comboDes}>Mua theo combo "{item.name}"</div>
            {item.items.map((value: any, key: number) => (
                <div
                    className={classNames(
                        styles.orderItem,
                        styles[style] || styles.primary,
                        className
                    )}
                    key={key}
                >
                    <div className={styles.orderImage}>
                        <div className={styles.image}>
                            <CachedImage src={value?.imageUrl} />
                        </div>
                        <div className={styles.badge}>{value?.quantity}</div>
                    </div>
                    <div className={styles.orderMain}>
                        <div className={styles.orderInfo}>
                            <div className={styles.name}>{value?.name}</div>
                            {<div className={styles.price}>{formatPrice(value?.price)}</div>}
                            {value?.description && (
                                <div className={styles.option}>{value?.description}</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div className={styles.comboTotal}>
                Tổng cộng: <span>{formatPrice(item?.total)}</span>
            </div>
        </div>
    );
};

export default OrderItemComboStatus;
