import React from "react";
import Link from "next/link";

import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths } from "@constants";
import { formatPrice, getProductDetailUrl } from "@utils";

import CachedImage from "@@@CachedImage";
import Quantity from "@@@Quantity";

import styles from "./ItemCombo.module.scss";
import { Desktop, Mobile } from "@components/Common/Media";

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
        <div>
            <Desktop>
                <div className={styles.itemCartWrap}>
                    <div className={styles.prodInfo}>
                        <div className={styles.image}>
                            <Link href={getProductDetailUrl(value?.slug)}>
                                <a>
                                    <CachedImage src={value?.imageUrl} />
                                </a>
                            </Link>
                        </div>
                        <div className={styles.infoWrap}>
                            <div className={styles.info}>
                                <Link href={getProductDetailUrl(value?.slug)}>
                                    <a className={styles.name}>{value?.name}</a>
                                </Link>
                                {value?.options.length > 0 && (
                                    <div className={styles.option}>
                                        {value?.options
                                            ?.map((opt: any) => {
                                                return opt.name;
                                            })
                                            .join(" / ")}
                                    </div>
                                )}
                            </div>
                            {(!stock || (stock && stock.quantity === 0)) && (
                                <div className={styles.outOfStock}>Hết hàng</div>
                            )}
                            {stock && stock.quantity > 0 && qty > stock.quantity && (
                                <div className={styles.outOfStock}>Vượt quá số lượng tồn kho</div>
                            )}
                        </div>
                    </div>
                    <div className={styles.figureWrap}>
                        <div className={styles.figureInfo}>
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
                            <div className={styles.price}>
                                {formatPrice(value?.price - value?.discount)}
                            </div>
                            <div className={styles.total}>
                                {formatPrice(value?.totalPrice - value?.totalDiscount)}
                            </div>
                        </div>
                    </div>
                </div>
            </Desktop>
            <Mobile>
                <div className={styles.itemCartWrap}>
                    <div className={styles.prodInfo}>
                        <div className={styles.image}>
                            <Link href={getProductDetailUrl(value?.slug)}>
                                <a>
                                    <CachedImage src={value?.imageUrl} />
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.wrap}>
                        <div className={styles.infoWrap}>
                            <div className={styles.info}>
                                <Link href={getProductDetailUrl(value?.slug)}>
                                    <a className={styles.name}>{value?.name}</a>
                                </Link>
                                <div className={styles.total}>
                                    {formatPrice(value?.totalPrice - value?.totalDiscount)}
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.figureInfo}>
                            {value?.options.length > 0 && (
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
            </Mobile>
        </div>
    );
};

export default ItemCombo;
