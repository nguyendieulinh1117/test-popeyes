import React from "react";

import classNames from "classnames";
import styles from "./index.module.scss";

interface CouponType {
    className?: any;
    isDisabled?: boolean;
    title: string;
    availableQuantity: number;
    description: string;
    onClick?: any;
}
const CouponTag: React.FC<CouponType> = ({
    className,
    isDisabled = false,
    title,
    availableQuantity,
    description,
    ...props
}) => {
    return (
        <div
            {...props}
            className={classNames(styles.item, className, { [styles.disable]: isDisabled })}
        >
            <div className={styles.couponLeft}>
                <div className={styles.circle}></div>
                <svg width="1px" height="56px" viewBox="0 0 1 56">
                    <line x1="0" y1="0" x2="1" y2="56" />
                </svg>
            </div>
            <div className={styles.text}>
                <div className={styles.code}>
                    {title}
                    <span>(Còn {availableQuantity})</span>
                </div>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default CouponTag;
