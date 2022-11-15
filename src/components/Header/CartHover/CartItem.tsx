import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { basketActions, productActions, promotionActions } from "@redux/actions";
import { getStringData, removeItem } from "@utils/localStorage";
import { paths, storageKeys } from "@constants";
import { formatPrice, getProductDetailUrl, sortItemJson } from "@utils";

import CachedImage from "@@@CachedImage";
import Quantity from "@@@Quantity";
import IconTrash from "@assets/icons/trash.svg";
import BaseModal from "@@@Modal";

import styles from "./CartItem.module.scss";
import { handleDeleteBasket, handleUpdateQuantity } from "@utils/basket";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import classNames from "classnames";
import { renderDiscount } from "@utils/discount";
import { setObjectData, setStringData } from "@utils/sessionStorage";
import { listErrorCodeVoucher } from "@constants/enum";
import { addToCartFunc, removeFromCartFunc } from "@utils/measureEcommerceGA";

const CartItem = ({ item, index, type = "normal" }: any) => {
    const dispatch = useDispatch();
    const { user } = useAuth();

    const [isShow, setIsShow] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [timeOutUpdate, setTimeOutUpdate] = useState<any>(0);

    const { basketData, checkStockData } = useSelectorTyped((state) => state.basket);
    const qtyProd = basketData?.products
        ?.filter((e: any) => e.sku === item.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);
    const qtyBonus = basketData?.bonusProducts
        ?.filter((e: any) => e.sku === item.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);

    const qtyCombo = basketData?.combos?.reduce(
        (prev, current) =>
            prev +
            current.products
                ?.filter((e: any) => e.sku === item.sku)
                ?.reduce((pre, cur) => pre + cur.quantity, 0),
        0
    );
    const qty = qtyProd + qtyBonus + qtyCombo;
    const stock = checkStockData?.find((e: any) => e.sku === item.sku);

    const [mess, setMess] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);

    const onUpdateQuantity = (value: number) => {
        clearTimeout(timeOutUpdate);
        setQuantity(value);
        setTimeOutUpdate(
            setTimeout(() => {
                updateBasket(value, index);
            }, 500)
        );
    };

    useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
        }
    }, [item]);

    const getBaskets = (id: string, baskets?: any) => {
        if (baskets.voucher !== null) {
            dispatch(
                promotionActions.checkPromotion({
                    actionrequest: {
                        params: {
                            code: baskets?.voucher?.code,
                            basketId: baskets?.basketId,
                            phoneNumber: user?.phone || null,
                        },
                        baskets: baskets,
                    },
                    onCompleted: (res: any) => {
                        setObjectData(storageKeys.PROMOTION, res?.data);
                        setStringData(storageKeys.PROMOTION_ERROR, "");
                        setStringData(storageKeys.PROMOTION_SUCCESS, "Áp dụng voucher thành công");
                        dispatch(basketActions.getBasket(id));
                        dispatch(basketActions.checkStockBasket(id));
                    },
                    onError: (err) => {
                        setObjectData(storageKeys.PROMOTION, {});
                        if (err.length > 0) {
                            setStringData(
                                storageKeys.PROMOTION_ERROR,
                                listErrorCodeVoucher[err[0].code] || "Không thể áp dụng voucher"
                            );
                        } else {
                            setStringData(storageKeys.PROMOTION_ERROR, "Không thể áp dụng voucher");
                        }
                        setStringData(storageKeys.PROMOTION_SUCCESS, "");
                        dispatch(
                            basketActions.updateBasket({
                                id: baskets?.basketId,
                                params: {
                                    ...baskets,
                                    voucher: null,
                                },
                                onCompleted: (res: any) => {
                                    if (res.success) {
                                        dispatch(basketActions.getBasket(id));
                                        dispatch(basketActions.checkStockBasket(id));
                                    }
                                },
                                onError: (err: any) => {
                                    toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                                    dispatch(
                                        basketActions.deleteBasket({
                                            params: { id: baskets?.basketId },
                                            onCompleted: (res: any) => {
                                                removeItem(storageKeys.BASKET_ID);
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 300);
                                            },
                                            onError: (err: any) => {},
                                        })
                                    );
                                },
                            })
                        );
                    },
                    onMess: (message: string) => {
                        setMess(message);
                    },
                })
            );
        } else {
            dispatch(basketActions.getBasket(id));
            dispatch(basketActions.checkStockBasket(id));
        }
    };

    const deleteItem = (index: number) => {
        const { products, body, productDelete } = handleDeleteBasket(basketData, index);
        removeFromCartFunc(productDelete)
        if (products.length < 1 && basketData.combos.length < 1) {
            dispatch(
                basketActions.deleteBasket({
                    params: { id: basketData.basketId },
                    onCompleted: (res: any) => {
                        setIsShow(false);
                        toast.success("Xóa sản phẩm thành công");
                        removeItem(storageKeys.BASKET_ID);
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                    },
                    onError: (err: any) => {},
                })
            );
        } else {
            dispatch(
                basketActions.updateBasket({
                    id: getStringData(storageKeys.BASKET_ID),
                    params: body,
                    onCompleted: onCompletedUpdate,
                    onError: (err: any) => {
                        setIsShow(false);
                        toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                        dispatch(
                            basketActions.deleteBasket({
                                params: { id: getStringData(storageKeys.BASKET_ID) },
                                onCompleted: (res: any) => {
                                    removeItem(storageKeys.BASKET_ID);
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 300);
                                },
                                onError: (err: any) => {},
                            })
                        );
                    },
                })
            );
        }
    };

    const updateBasket = (quantity: number, index: number) => {
        dispatch(
            productActions.getProductDetailBySlug({
                params: { slug: item?.slug },
                onCompleted: (res) => {
                    const { body } = handleUpdateQuantity(basketData, index, quantity, res.data);

                    dispatch(
                        basketActions.updateBasket({
                            id: getStringData(storageKeys.BASKET_ID),
                            params: body,
                            onCompleted: (res: any) => {
                                if (res.success) {
                                    getBaskets(res.data.basketId, res.data);

                                    //ga
                                    addToCartFunc(res.data)
                                }
                            },
                            onError: (err: any) => {
                                toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                                dispatch(
                                    basketActions.deleteBasket({
                                        params: { id: getStringData(storageKeys.BASKET_ID) },
                                        onCompleted: (res: any) => {
                                            removeItem(storageKeys.BASKET_ID);
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 300);
                                        },
                                        onError: (err: any) => {},
                                    })
                                );
                            },
                        })
                    );
                },
                onError: (err) => {
                    toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                    dispatch(
                        basketActions.deleteBasket({
                            params: { id: getStringData(storageKeys.BASKET_ID) },
                            onCompleted: (res: any) => {
                                removeItem(storageKeys.BASKET_ID);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 300);
                            },
                            onError: (err: any) => {},
                        })
                    );
                },
            })
        );
    };
    const onCompletedUpdate = (res: any) => {
        if (res.success) {
            toast.success("Xóa sản phẩm thành công");
            setIsShow(false);
            getBaskets(res.data.basketId, res.data);
        }
    };

    const renderPrice = useMemo(() => {
        let salePrice = item?.price;
        let discount = item?.discount;

        if (item?.promotion) {
            let dis = renderDiscount(
                salePrice,
                item?.promotion?.discount,
                item?.promotion?.maxDiscount,
                item?.promotion?.discountPercentage,
                item?.promotion?.fixedPrice
            );

            return (
                <div className={styles.price}>
                    {formatPrice(salePrice - dis || 0)}
                    <span className={styles.discount}>{formatPrice(salePrice || 0)}</span>
                </div>
            );
        } else {
            if (discount !== 0) {
                return (
                    <div className={styles.price}>
                        {formatPrice(salePrice - discount || 0)}
                        <span className={styles.discount}>{formatPrice(salePrice || 0)}</span>
                    </div>
                );
            } else {
                return <div className={styles.price}>{formatPrice(salePrice || 0)}</div>;
            }
        }
    }, [item]);

    const renderTotal = useMemo(() => {
        let salePrice = item?.price;
        let discount = item?.discount;
        let totalPrice = item?.totalPrice;
        let totalDiscount = item.totalDiscount;
        let quantity = item.quantity;

        if (item?.promotion) {
            let dis = renderDiscount(
                salePrice,
                item?.promotion?.discount,
                item?.promotion?.maxDiscount,
                item?.promotion?.discountPercentage,
                item?.promotion?.fixedPrice
            );

            return totalPrice - totalDiscount - dis * quantity;
        } else {
            return totalPrice - totalDiscount;
        }
    }, [item]);
    return (
        <div className={styles.item}>
            {type !== "gift" && item.promotion && (
                <div className={styles.comboBonus}>{item?.promotion?.name}</div>
            )}
            <div className={styles.itemWrap}>
                <div className={styles.itemImage}>
                    {type !== "gift" ? (
                        <Link href={getProductDetailUrl(item?.slug)}>
                            <a>
                                <CachedImage src={item.imageUrl} />
                            </a>
                        </Link>
                    ) : (
                        <CachedImage src={item.imageUrl} />
                    )}
                </div>
                <div className={styles.itemInfo}>
                    <div className={styles.infoWrap}>
                        <div className={styles.property}>
                            {type !== "gift" ? (
                                <Link href={getProductDetailUrl(item?.slug)}>
                                    <a className={styles.name}>{item.name}</a>
                                </Link>
                            ) : (
                                <div className={styles.name}>QUÀ TẶNG - {item.name}</div>
                            )}
                            {type !== "gift" ? (
                                renderPrice
                            ) : (
                                <div className={styles.price}>
                                    Trị giá: {formatPrice(item.price - item.discount)}
                                </div>
                            )}

                            {type !== "gift" && item.options.length > 0 && (
                                <div className={styles.size}>
                                    {item.options
                                        .map((e: any) => {
                                            return e.name;
                                        })
                                        .join(" / ")}
                                </div>
                            )}
                            {type !== "gift" && (!stock || (stock && stock.quantity === 0)) && (
                                <div className={styles.outOfStock}>Hết hàng</div>
                            )}
                            {type !== "gift" &&
                                stock &&
                                stock.quantity > 0 &&
                                qty > stock.quantity && (
                                    <div className={styles.outOfStock}>
                                        Vượt quá số lượng tồn kho
                                    </div>
                                )}
                        </div>
                        {type !== "gift" && (
                            <div className={styles.delete} onClick={() => setIsShow(true)}>
                                <IconTrash />
                            </div>
                        )}
                    </div>
                    <div className={styles.figure}>
                        {type !== "gift" ? (
                            <Quantity
                                value={quantity}
                                onUpdate={onUpdateQuantity}
                                classNameParent={styles.quantityParent}
                                className={styles.quantity}
                                quantityAvailable={
                                    stock
                                        ? qty > stock.quantity
                                            ? quantity
                                            : stock.quantity
                                        : quantity
                                }
                                quantityLimit={
                                    stock
                                        ? qty > stock.quantity
                                            ? quantity
                                            : stock.quantity
                                        : quantity
                                }
                            />
                        ) : (
                            <Quantity
                                value={quantity}
                                classNameParent={styles.quantityParent}
                                className={classNames(styles.quantity, styles.qtyDisabled)}
                                quantityAvailable={quantity}
                                quantityLimit={quantity}
                            />
                        )}

                        {type !== "gift" && (
                            <div className={styles.total}>
                                <p className={styles.totalContent}>Tổng cộng:</p>
                                <span>{formatPrice(renderTotal)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BaseModal
                isOpen={isShow}
                onClose={() => setIsShow(false)}
                bodyClass={styles.modalBody}
                confirmButtonLabel="Xóa"
                onConfirm={() => deleteItem(index)}
                onCancel={() => setIsShow(false)}
                cancelButtonLabel="Hủy"
                headerClass={styles.modalHeader}
                footerClass={styles.modalFooter}
            >
                <div className={styles.modalTitle}>Bạn có chắc muốn xóa sản phẩm này?</div>
            </BaseModal>
            {mess !== "" && (
                <BaseModal
                    isOpen={show}
                    onClose={() => setShow(false)}
                    bodyClass={styles.modalBody}
                    confirmButtonLabel="Đã hiểu"
                    onConfirm={() => setShow(false)}
                    headerClass={styles.modalHeader}
                    footerClass={styles.modalFooter}
                >
                    <div className={styles.modalTitle}>
                        <p>{mess}</p>
                    </div>
                </BaseModal>
            )}
        </div>
    );
};

export default CartItem;
