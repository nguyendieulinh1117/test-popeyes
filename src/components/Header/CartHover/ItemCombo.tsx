import React from "react";
import Link from "next/link";
import { paths } from "@constants";
import { formatPrice, getProductDetailUrl } from "@utils";

import Quantity from "@@@Quantity";
import CachedImage from "@@@CachedImage";

import styles from "./ItemCombo.module.scss";
import { useSelectorTyped } from "@hooks/useSelectorType";

const ItemCombo = ({ value }: any) => {
    const { basketData, checkStockData } = useSelectorTyped((state) => state.basket);
    const qtyProd = basketData?.products
        ?.filter((e: any) => e.sku === value.sku)
        .reduce((prev, current) => prev + current.quantity, 0);
    const qtyBonus = basketData?.bonusProducts
        ?.filter((e: any) => e.sku === value.sku)
        .reduce((prev, current) => prev + current.quantity, 0);

    const qtyCombo = basketData?.combos?.reduce(
        (prev, current) =>
            prev +
            current?.products
                ?.filter((e: any) => e.sku === value.sku)
                ?.reduce((pre, cur) => pre + cur.quantity, 0),
        0
    );
    const qty = qtyProd + qtyBonus + qtyCombo;
    const stock = checkStockData?.find((e: any) => e.sku === value.sku);
    return (
        <div className={styles.itemWrap}>
            <div className={styles.itemImage}>
                <Link href={getProductDetailUrl(value?.slug)}>
                    <a>
                        <CachedImage src={value.imageUrl} />
                    </a>
                </Link>
            </div>
            <div className={styles.itemInfo}>
                <div className={styles.infoWrap}>
                    <div className={styles.property}>
                        <Link href={getProductDetailUrl(value?.slug)}>
                            <a className={styles.name}>{value.name}</a>
                        </Link>
                        {value.discount > 0 ? (
                            <div className={styles.price}>
                                {formatPrice(value.price - value.discount)}
                                <span className={styles.discount}>{formatPrice(value.price)}</span>
                            </div>
                        ) : (
                            <div className={styles.price}>{formatPrice(value.price)}</div>
                        )}

                        {value.options.length > 0 && (
                            <div className={styles.size}>
                                {value.options
                                    .map((e: any) => {
                                        return e.name;
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
                </div>
                <div className={styles.figure}>
                    <Quantity
                        value={value.quantity}
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
