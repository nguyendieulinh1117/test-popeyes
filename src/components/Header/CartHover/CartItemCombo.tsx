import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { basketActions, productActions, promotionActions } from "@redux/actions";
import { getStringData, removeItem } from "@utils/localStorage";
import { paths, storageKeys } from "@constants";
import { formatPrice, sortItemJson } from "@utils";

import CachedImage from "@@@CachedImage";
import Quantity from "@@@Quantity";
import IconTrash from "@assets/icons/trash.svg";
import BaseModal from "@@@Modal";

import styles from "./CartItemCombo.module.scss";
import { handleDeleteCombo } from "@utils/basket";
import Link from "next/link";
import ItemCombo from "./ItemCombo";
import useAuth from "@hooks/useAuth";
import { setObjectData, setStringData } from "@utils/sessionStorage";
import { listErrorCodeVoucher } from "@constants/enum";

const CartItemCombo = ({ item, index }: any) => {
    const dispatch = useDispatch();

    const [isShow, setIsShow] = useState<boolean>(false);
    const { user } = useAuth();

    const { basketData } = useSelectorTyped((state) => state.basket);
    const [mess, setMess] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);

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
                        setStringData(storageKeys.PROMOTION_SUCCESS, "??p d???ng voucher th??nh c??ng");
                        dispatch(basketActions.getBasket(id));
                        dispatch(basketActions.checkStockBasket(id));
                    },
                    onError: (err) => {
                        setObjectData(storageKeys.PROMOTION, {});
                        if (err.length > 0) {
                            setStringData(
                                storageKeys.PROMOTION_ERROR,
                                listErrorCodeVoucher[err[0].code] || "Kh??ng th??? ??p d???ng voucher"
                            );
                        } else {
                            setStringData(storageKeys.PROMOTION_ERROR, "Kh??ng th??? ??p d???ng voucher");
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
                                    toast.error("??ang x???y ra l???i! Gi??? h??ng kh??ng t???n t???i");
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

        if (combos.length < 1 && basketData.products.length < 1) {
            dispatch(
                basketActions.deleteBasket({
                    params: { id: basketData.basketId },
                    onCompleted: (res: any) => {
                        setIsShow(false);
                        toast.success("X??a combo th??nh c??ng");
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
                        toast.error("??ang x???y ra l???i! Gi??? h??ng kh??ng t???n t???i");
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

    const onCompletedUpdate = (res: any) => {
        if (res.success) {
            toast.success("X??a combo th??nh c??ng");
            setIsShow(false);
            getBaskets(res.data.basketId, res.data);
        }
    };

    return (
        <div className={styles.item}>
            <div className={styles.comboBonus}>
                Mua theo combo {item?.name}
                <div className={styles.delete} onClick={() => setIsShow(true)}>
                    <IconTrash />
                </div>
            </div>
            {item?.products.map((value, key) => (
                <ItemCombo value={value} key={key} />
            ))}
            <div className={styles.total}>
                <p className={styles.totalContent}>T???ng c???ng:</p>
                <span>{formatPrice(item?.salePrice)}</span>
            </div>

            <BaseModal
                isOpen={isShow}
                onClose={() => setIsShow(false)}
                bodyClass={styles.modalBody}
                confirmButtonLabel="X??a"
                onConfirm={() => deleteItem(index)}
                onCancel={() => setIsShow(false)}
                cancelButtonLabel="H???y"
                headerClass={styles.modalHeader}
                footerClass={styles.modalFooter}
            >
                <div className={styles.modalTitle}>B???n c?? ch???c mu???n x??a combo n??y?</div>
            </BaseModal>
            {mess !== "" && (
                <BaseModal
                    isOpen={show}
                    onClose={() => setShow(false)}
                    bodyClass={styles.modalBody}
                    confirmButtonLabel="???? hi???u"
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
