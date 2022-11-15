import React from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import IconPlus from "@assets/icons/plus.svg";
import IconMinus from "@assets/icons/minus.svg";

type QuantityPropTypes = {
    value?: number,
    quantityLimit?: number,
    onUpdate: Function,
    onDelete?: boolean,
    quantityAvailable?: any,
    disable?: string,
    readOnly?: boolean,
    className?: string,
    classNameParent?: string,
}

const Quantity = ({
    value = 1,
    onUpdate,
    quantityAvailable,
    disable,
    readOnly,
    className,
    onDelete,
    quantityLimit,
    classNameParent,
}: QuantityPropTypes) => {

    const reachedLimit = quantityLimit && quantityLimit <= value;
    const disabledIncrease = quantityAvailable - value < 1 || reachedLimit;
    const overLimit = quantityLimit && quantityLimit < value;

    return (
        <div className={classNames(styles.quantityBlock, classNameParent)}>
            <div
                className={classNames(styles.quantity, className, {
                    [styles.disableControl]: quantityAvailable < 1,
                    [styles.overLimit]: overLimit,
                })}
            >
                <button
                    type="button"
                    className={classNames(value === 1 && !onDelete && styles.disableButton)}
                    onClick={() => changeValue(-1)}
                >
                    <IconMinus />
                </button>
                <label>
                    <input value={value} readOnly={readOnly} disabled={quantityAvailable < 1} placeholder=''/>
                </label>
                <button
                    type="button"
                    className={classNames(disabledIncrease && styles.disableButton)}
                    onClick={() => !disabledIncrease && changeValue(1)}
                >
                    <IconPlus />
                </button>
            </div>
            {reachedLimit && (
                <div className={styles.expand}>
                    {[
                        ` Số lượng tối đa: ${quantityLimit}`,
                        overLimit && "Hãy giảm số lượng để đặt hàng",
                    ]
                        .filter(Boolean)
                        .join(". ")}
                </div>
            )}
        </div>
    );

    function changeValue(param: any) {
        let currentQuantity = value + param;
        if (currentQuantity < 1 && !onDelete) {
            currentQuantity = 1;
        }
        if (currentQuantity > quantityAvailable) {
            currentQuantity = quantityAvailable;
        }
        onUpdate(currentQuantity);
    }
};

Quantity.defaultProps = {
    onUpdate: () => {},
    disable: false,
    readOnly: true,
    value: 1,
};

export default Quantity;
