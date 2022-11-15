import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import styles from "./OrderItem.module.scss";
import CachedImage from "../CachedImage";
import { formatPrice, getProductDetailUrl, isEmptyObject } from "@utils";
import Link from "next/link";
import { paths, storageKeys } from "@constants";
import Quantity from "../Quantity";
import { useDispatch } from "react-redux";
import { basketActions, productActions, promotionActions } from "@redux/actions";
import { handleDeleteBasket, handleUpdateQuantity } from "@utils/basket";
import { toast } from "react-toastify";
import { getStringData, removeItem } from "@utils/localStorage";
import BaseModal from "../Modal";
import IconTrash from "@assets/icons/trash.svg";
import { useSelectorTyped } from "@hooks/useSelectorType";
import useAuth from "@hooks/useAuth";
import { renderDiscount } from "@utils/discount";
import { setObjectData, setStringData } from "@utils/sessionStorage";
import { listErrorCodeVoucher } from "@constants/enum";
import { addToCartFunc, removeFromCartFunc } from "@utils/measureEcommerceGA";

const OrderItem = ({
    className,
    style = "primary",
    data,
    type,
    productDiscounts,
    basketData,
    index,
}: any) => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [total, setTotal] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [timeOutUpdate, setTimeOutUpdate] = useState<any>(0);
    const [isShow, setIsShow] = useState<boolean>(false);
    const { checkStockData } = useSelectorTyped((state) => state.basket);
    const qtyProd = basketData?.products
        ?.filter((e: any) => e.sku === data.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);
    const qtyBonus = basketData?.bonusProducts
        ?.filter((e: any) => e.sku === data.sku)
        ?.reduce((prev, current) => prev + current.quantity, 0);

    const qtyCombo = basketData?.combos?.reduce(
        (prev, current) =>
            prev +
            current.products
                ?.filter((e: any) => e.sku === data.sku)
                ?.reduce((pre, cur) => pre + cur.quantity, 0),
        0
    );
    const qty = qtyProd + qtyBonus + qtyCombo;
    const stock = checkStockData?.find((e: any) => e.sku === data.sku);
    const [mess, setMess] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);

    useEffect(() => {
        // setTotal(data?.totalPrice - data?.totalDiscount || 0);
        setQuantity(data?.quantity);
    }, [data]);

    const discountPromotion = useMemo(() => {
        let salePrice = data?.price;
        let discount = data?.discount;
        let totalPrice = data?.totalPrice;
        let totalDiscount = data.totalDiscount;
        let quantity = data.quantity;

        if (type !== "gift") {
            let productDiscount = productDiscounts?.find((item) => item.productId === data.id);
            if (productDiscount && productDiscount?.discount > 0) {
                if (data?.promotion) {
                    let dis = renderDiscount(
                        salePrice,
                        data?.promotion?.discount,
                        data?.promotion?.maxDiscount,
                        data?.promotion?.discountPercentage,
                        data?.promotion?.fixedPrice
                    );
                    setTotal(
                        totalPrice - totalDiscount - dis * quantity - productDiscount.discount || 0
                    );
                } else {
                    setTotal(totalPrice - totalDiscount - productDiscount.discount || 0);
                }

                return (
                    <span>{`(Bạn được giảm giá ${formatPrice(productDiscount.discount)})`}</span>
                );
            } else {
                if (data?.promotion) {
                    let dis = renderDiscount(
                        salePrice,
                        data?.promotion?.discount,
                        data?.promotion?.maxDiscount,
                        data?.promotion?.discountPercentage,
                        data?.promotion?.fixedPrice
                    );
                    setTotal(totalPrice - totalDiscount - dis * quantity || 0);
                } else {
                    setTotal(totalPrice - totalDiscount || 0);
                }
            }
        } else {
            setTotal(data?.totalPrice - data?.totalDiscount || 0);
            return <></>;
        }
    }, [productDiscounts, data]);

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

    const onUpdateQuantity = (value: number) => {
        clearTimeout(timeOutUpdate);
        setQuantity(value);
        setTimeOutUpdate(
            setTimeout(() => {
                updateBasket(value, index);
            }, 500)
        );
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
                params: { slug: data?.slug },
                onCompleted: (res) => {
                    const { body } = handleUpdateQuantity(basketData, index, quantity, res.data);

                    dispatch(
                        basketActions.updateBasket({
                            id: getStringData(storageKeys.BASKET_ID),
                            params: body,
                            onCompleted: (res: any) => {
                                if (res.success) {
                                    getBaskets(res.data.basketId, res.data);
                                    // console.log(res.data.voucher !== null);
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

    if (type === "gift" && !data && isEmptyObject(data)) {
        return <></>;
    }

    const renderPrice = useMemo(() => {
        let salePrice = data?.price;
        let discount = data?.discount;
        if (data?.promotion) {
            let dis = renderDiscount(
                salePrice,
                data?.promotion?.discount,
                data?.promotion?.maxDiscount,
                data?.promotion?.discountPercentage,
                data?.promotion?.fixedPrice
            );

            return salePrice - dis;
        } else {
            if (discount !== 0) {
                return salePrice - discount;
            } else {
                return salePrice;
            }
        }
    }, [data]);

    return (
        <>
            <div
                className={classNames(
                    styles.orderItem,
                    styles[style] || styles.primary,
                    className,
                    { [styles.disableLink]: type === "gift" }
                )}
            >
                <div className={styles.orderImage}>
                    <Link href={getProductDetailUrl(data?.slug)} passHref>
                        <div className={styles.image}>
                            <CachedImage src={type === "gift" ? data?.imageUrl : data?.imageUrl} />
                        </div>
                    </Link>
                    <div className={styles.badge}>{data?.quantity}</div>
                </div>
                <div className={styles.orderMain}>
                    <div className={styles.orderInfo}>
                        <Link href={getProductDetailUrl(data?.slug)} passHref>
                            {type === "gift" ? (
                                <div className={styles.name}>QUÀ TẶNG - {data?.name}</div>
                            ) : (
                                <div className={styles.name}>{data?.name}</div>
                            )}
                        </Link>
                        {type === "gift" ? (
                            <div className={styles.price}>
                                Trị giá: {formatPrice(data?.price || 0)}
                            </div>
                        ) : (
                            <div className={styles.price}>
                                {formatPrice(renderPrice || 0)}
                                {data?.discount > 0 && (
                                    <span className={styles.delPrice}>
                                        {formatPrice(data?.price)}
                                    </span>
                                )}
                                <div className={styles.discount}>{discountPromotion}</div>
                            </div>
                        )}
                        {type !== "gift" && data?.options?.length > 0 && (
                            <div className={styles.option}>
                                {data?.options
                                    ?.map((opt: any) => {
                                        return opt.name;
                                    })
                                    .join(" / ")}
                            </div>
                        )}
                        {type !== "gift" && (
                            <>
                                {data?.promotion && (
                                    <div className={styles.promotion}>{data?.promotion?.name}</div>
                                )}
                                {(!stock || (stock && stock.quantity === 0)) && (
                                    <div className={styles.outOfStock}>Hết hàng</div>
                                )}
                                {stock && stock.quantity > 0 && qty > stock.quantity && (
                                    <div className={styles.outOfStock}>
                                        Vượt quá số lượng tồn kho
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {type !== "gift" && (
                        <div className={styles.orderTotal}>
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

                            <div className={styles.total}>
                                <p>Tổng cộng:</p>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    )}
                </div>
                {type !== "gift" && (
                    <div className={styles.delete} onClick={() => setIsShow(true)}>
                        <IconTrash />
                    </div>
                )}
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
        </>
    );
};

export default OrderItem;
