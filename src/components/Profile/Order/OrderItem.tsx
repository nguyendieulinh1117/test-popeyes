import React, { useMemo } from "react";
import moment from "moment";

import CachedImage from "@@@CachedImage";
import { formatPrice } from "@utils";
import IconDelivery from "@assets/icons/delivery.svg";
import IconPending from "@assets/icons/pending-icon.svg";
import IconRequestCancel from "@assets/icons/cancel-order-icon.svg";
import Link from "next/link";
import { paths } from "@constants";
import { Desktop } from "@@@Media";

import style from "./OrderItem.module.scss";

type PropsType = {
    orderItem: any;
};

const OrderItem = (props: PropsType) => {
    const { orderItem } = props;

    const renderStatus = useMemo(() => {
        if (orderItem.status === "Pending" || orderItem.status === "PaymentFailed") {
            return (
                <div className={style.status}>
                    <Desktop>
                        <span>
                            <IconPending />
                            Đã đặt thành công
                        </span>
                    </Desktop>
                    CHỜ XÁC NHẬN
                </div>
            );
        } else if (orderItem.status === "Processing" || orderItem.status === "Preparing") {
            return (
                <div className={style.status}>
                    <Desktop>
                        <span>
                            <IconDelivery />
                            Đơn hàng đang giao đến bạn
                        </span>
                    </Desktop>
                    ĐANG XỬ LÝ
                </div>
            );
        } else if (orderItem.status === "Shipping") {
            return (
                <div className={style.status}>
                    <Desktop>
                        <span>
                            <IconDelivery />
                            Đơn hàng đang giao đến bạn
                        </span>
                    </Desktop>
                    ĐANG GIAO
                </div>
            );
        } else if (orderItem.status === "Shipped" || orderItem.status === "Completed") {
            return (
                <div className={style.status}>
                    <Desktop>
                        <span>
                            <IconDelivery />
                            Giao hàng thành công
                        </span>
                    </Desktop>
                    HOÀN THÀNH
                </div>
            );
        } else if (orderItem.status === "Closed") {
            return (
                <div className={style.status}>
                    <Desktop>
                        <span>
                            <IconDelivery />
                            Giao hàng thành công
                        </span>
                    </Desktop>
                    ĐÃ KẾT THÚC
                </div>
            );
        } else if (orderItem.status === "RequestCancel" || orderItem.status === "Cancelled") {
            return <div className={style.status}>ĐÃ HUỶ</div>;
        } else {
            return <></>;
        }
    }, [orderItem.status]);

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

    const comboArr = mergeCombo(
        mergeProduct(orderItem?.items?.filter((e) => e.comboCode !== null))
    );

    return (
        <Link href={`${paths.profile.detailOrder}/${orderItem.code}`} passHref>
            <div className={style.orderItem}>
                <div className={style.header}>
                    <div className={style.info}>
                        <div className={style.code}>
                            Mã đơn hàng: <span>{orderItem.code}</span>
                        </div>
                        <Desktop>
                            <div className={style.date}>
                                Đặt ngày:{" "}
                                <span>{moment(orderItem.createdTime).format("DD/MM/YYYY")}</span>
                            </div>
                        </Desktop>
                    </div>
                    {renderStatus}
                </div>
                <div className={style.body}>
                    {orderItem.items
                        ?.filter((e) => e.comboCode === null)
                        ?.map((item: any, index: number) => (
                            <div key={index} className={style.productItem}>
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
                                                <span>{formatPrice(item.price)}</span>{" "}
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
                                {item.items.map((value: any, key: number) => (
                                    <div key={key} className={style.productItem}>
                                        <div className={style.productImage}>
                                            <CachedImage src={value.imageUrl} />
                                        </div>
                                        <div className={style.productInfo}>
                                            <div className={style.name}>
                                                <p>{value.name}</p>
                                                {value.description && (
                                                    <span>{value.description}</span>
                                                )}
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
                            </div>
                        ))}
                </div>
                <div className={style.footer}>
                    Tổng thanh toán:
                    <span>
                        {orderItem?.payment?.amount > 0
                            ? formatPrice(orderItem?.payment?.amount || 0)
                            : formatPrice(0)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default OrderItem;
