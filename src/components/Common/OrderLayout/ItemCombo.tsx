import React from "react";
import Link from "next/link";

import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths } from "@constants";
import { formatPrice, getProductDetailUrl } from "@utils";

import CachedImage from "../CachedImage";
import Quantity from "../Quantity";

import styles from "./ItemCombo.module.scss";

const ItemCombo = ({ value }: any) => {
    const { basketData, checkStockData } = useSelectorTyped((state) => state.basket);
    const qtyProd = basketData?.products
        ?.filter((e: any) => e.sku === value.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);
    const qtyBonus = basketData?.bonusProducts
        ?.filter((e: any) => e.sku === value.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);

    const qtyCombo = basketData?.combos?.reduce(
        (prev, current) =>
            prev +
            current.products
                .filter((e: any) => e.sku === value.sku)
                .reduce((pre, cur) => pre + cur.quantity, 0),
        0
    );
    const qty = qtyProd + qtyBonus + qtyCombo;
    const stock = checkStockData.find((e: any) => e.sku === value.sku);
    return (
        <div className={styles.orderItemWrap}>
            <div className={styles.orderImage}>
                <Link href={getProductDetailUrl(value?.slug)} passHref>
                    <div className={styles.image}>
                        <CachedImage src={value?.imageUrl} />
                    </div>
                </Link>
                <div className={styles.badge}>{value?.quantity}</div>
            </div>
            <div className={styles.orderMain}>
                <div className={styles.orderInfo}>
                    <Link href={getProductDetailUrl(value?.slug)} passHref>
                        <div className={styles.name}>{value?.name}</div>
                    </Link>

                    <div className={styles.price}>
                        {formatPrice(value?.price - value?.discount || 0)}
                    </div>

                    {value?.options?.length > 0 && (
                        <div className={styles.option}>
                            {value?.options
                                ?.map((opt: any) => {
                                    return opt.name;
                                })
                                .join(" / ")}
                        </div>
                    )}
                    {(!stock || (stock && stock.quantity === 0)) && (
                        <div className={styles.outOfStock}>Hết hàng</div>
                    )}
                    {stock && stock.quantity > 0 && qty > stock.quantity && (
                        <div className={styles.outOfStock}>Vượt quá số lượng tồn kho</div>
                    )}
                </div>
                <div className={styles.orderTotal}>
                    <Quantity
                        value={value?.quantity}
                        classNameParent={styles.quantityParent}
                        className={styles.quantity}
                        quantityAvailable={
                            stock
                                ? qty > stock.quantity
                                    ? value.quantity
                                    : stock.quantity
                                : value.quantity
                        }
                        quantityLimit={
                            stock
                                ? qty > stock.quantity
                                    ? value.quantity
                                    : stock.quantity
                                : value.quantity
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default ItemCombo;
