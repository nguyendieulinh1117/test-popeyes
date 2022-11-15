import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";

import { useSelectorTyped } from "@hooks/useSelectorType";
import { basketActions, productActions, promotionActions } from "@redux/actions";
import { getStringData, removeItem } from "@utils/localStorage";
import { handleDeleteCombo } from "@utils/basket";
import { paths, storageKeys } from "@constants";
import { formatPrice } from "@utils";

import CachedImage from "@@@CachedImage";
import IconTrash from "@assets/icons/trash.svg";
import Quantity from "@@@Quantity";
import { Desktop, Mobile } from "@@@Media";
import BaseModal from "@@@Modal";

import classNames from "classnames";
import styles from "./CartItemCombo.module.scss";
import ItemCombo from "./ItemCombo";
import useAuth from "@hooks/useAuth";
import { setObjectData, setStringData } from "@utils/sessionStorage";
import { listErrorCodeVoucher } from "@constants/enum";

const CartItemCombo = ({ item, index }: any) => {
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState<boolean>(false);
    const { user } = useAuth();
    const [mess, setMess] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);

    const { basketData } = useSelectorTyped((state) => state.basket);

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
        const { combos, body } = handleDeleteCombo(basketData, index);

        if (combos.length < 1 && basketData?.products.length < 1) {
            dispatch(
                basketActions.deleteBasket({
                    params: { id: basketData.basketId },
                    onCompleted: (res: any) => {
                        setIsShow(false);
                        toast.success("Xóa combo thành công");
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
                    onCompleted: (res) => {
                        setIsShow(false);
                        toast.success("Xóa combo thành công");
                        getBaskets(res.data.basketId, res.data);
                    },
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

    return (
        <div className={styles.itemCart}>
            <Desktop>
                <div className={styles.combo}>
                    Mua theo combo {item.name}
                    <div className={styles.comboPrice}>{formatPrice(item.salePrice)}</div>
                </div>
                {item?.products?.map((value: any, key: number) => (
                    <ItemCombo value={value} key={key} />
                ))}
                <div className={styles.delete} onClick={() => setIsShow(true)}>
                    <IconTrash />
                </div>
            </Desktop>
            <Mobile>
                <div className={styles.combo}>
                    Mua theo combo {item.name}
                    <div className={styles.delete} onClick={() => setIsShow(true)}>
                        <IconTrash />
                    </div>
                </div>
                {item?.products?.map((value: any, key: number) => (
                    <ItemCombo value={value} key={key} />
                ))}
                <div className={styles.comboPrice}>
                    Tổng cộng: <span>{formatPrice(item.salePrice)}</span>
                </div>
            </Mobile>
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
                <div className={styles.modalTitle}>Bạn có chắc muốn xóa combo này?</div>
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

export default CartItemCombo;
