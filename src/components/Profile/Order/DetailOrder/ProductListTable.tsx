import React from "react";
import style from "./ProductListTable.module.scss";

import CachedImage from "@components/Common/CachedImage";
import { formatPrice } from "@utils";

const ProductListTable = ({ data }: any) => {
    const shippingFee = data?.shipping?.estimatedAmount || 0;
    const voucherDiscount = data?.voucher?.amount || 0;
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

    const mergeProduct = (arrFilter: any) => {
        let arr: any[] = [];
        if (arrFilter !== undefined && arrFilter.length > 0) {
            const a = arrFilter.filter((e) => e.comboCode === arrFilter[0].comboCode);
            const b = arrFilter.filter((e) => e.comboCode !== arrFilter[0].comboCode);

            arr.push(a);

            if (b.length > 0) {
                return [a, ...mergeProduct(b)];
            } else {
                return arr;
            }
        } else {
            return [];
        }
    };

    const mergeCombo = (arr: any) => {
        let a: any[] = [];
        arr.forEach((item) => {
            let total = item.reduce(
                (prev, current) => prev + (current.price - current.discount) * current.quantity,
                0
            );
            a.push({
                name: item[0].comboName,
                code: item[0].comboCode,
                items: item,
                total: total,
            });
        });
        return a;
    };

    const comboArr = mergeCombo(mergeProduct(data?.items?.filter((e) => e.comboCode !== null)));

    return (
        <div className={style.productTable}>
            <div className={style.tableHeader}>SẢN PHẨM ({data?.items?.length})</div>

            <div className={style.body}>
                {data?.items
                    ?.filter((e) => e.comboCode === null)
                    ?.map((item: any, index: number) => (
                        <div className={style.productItem} key={`produc_id_${index}`}>
                            <div className={style.productImage}>
                                <CachedImage src={item.imageUrl} />
                            </div>
                            <div className={style.productInfo}>
                                <div className={style.name}>
                                    <p>
                                        {item?.source === "Promotion" && "QUÀ TẶNG - "}
                                        {item.name}
                                    </p>
                                    {item?.source !== "Promotion" && item.description && (
                                        <span>{item.description}</span>
                                    )}
                                </div>
                                <div className={style.pay}>
                                    <div className={style.qty}>x{item.quantity}</div>
                                    {item.discount > 0 ? (
                                        <div className={style.priceDiscount}>
                                            <span>{formatPrice(item?.price)}</span>{" "}
                                            {formatPrice(item.price - item.discount)}
                                        </div>
                                    ) : (
                                        <div className={style.priceNoDiscount}>
                                            {formatPrice(item.price - item.discount)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                {comboArr.length > 0 &&
                    comboArr?.map((item: any, index: number) => (
                        <div className={style.productCombo} key={index}>
                            <div className={style.comboDes}>Mua theo combo "{item.name}"</div>
                            {item.items?.map((value: any, key: number) => (
                                <div className={style.productItem} key={`produc_id_${key}`}>
                                    <div className={style.productImage}>
                                        <CachedImage src={value.imageUrl} />
                                    </div>
                                    <div className={style.productInfo}>
                                        <div className={style.name}>
                                            <p>{value.name}</p>
                                            {value.description && <span>{value.description}</span>}
                                        </div>
                                        <div className={style.pay}>
                                            <div className={style.qty}>x{value.quantity}</div>

                                            <div className={style.priceNoDiscount}>
                                                {formatPrice(value.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className={style.comboTotal}>
                                Tổng cộng: <span>{formatPrice(item.total)}</span>
                            </div>
                        </div>
                    ))}
            </div>
            <div className={style.tableFooter}>
                <div className={style.col}>
                    <p>Tổng tạm tính</p>
                    <p>Phí vận chuyển</p>
                    <p>Giảm giá</p>
                    <p>Tổng số tiền</p>
                </div>
                <div className={style.col}>
                    <p>{formatPrice(totalPriceTemp() || 0)}</p>
                    <p>{formatPrice(shippingFee)}</p>
                    <p>{formatPrice(voucherDiscount)}</p>
                    <p className={style.total}>
                        {data?.payment?.amount > 0
                            ? formatPrice(data?.payment?.amount || 0)
                            : formatPrice(0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductListTable;
