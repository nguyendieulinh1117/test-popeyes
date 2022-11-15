import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./VoucherForm.module.scss";
import { useDispatch } from "react-redux";

import BasicForm from "@@@Form/BasicForm";
import InputTextField from "@@@Form/InputTextField";
import classNames from "classnames";
import Button from "@@@Form/Button";
import { basketActions, promotionActions } from "@redux/actions";
import useBasketCheckOut from "@hooks/useBasketCheckOut";
import useAuth from "@hooks/useAuth";
import CouponTag from "../CouponTag";
import { isEmptyObject } from "@utils";
import { listErrorCodeVoucher } from "@constants/enum";
import { toast } from "react-toastify";
import BaseModal from "../Modal";
import { removeItem } from "@utils/localStorage";
import { storageKeys } from "@constants";
import { getObjectData, getStringData, setObjectData, setStringData } from "@utils/sessionStorage";

const VoucherForm = ({ basketData, setPromotion, promotion }: any) => {
    const dispatch = useDispatch();
    const formRef = useRef<any>(null);
    const { basketId } = useBasketCheckOut();
    const { user, isAuthenticated } = useAuth();

    const [listCoupon, setListCoupon] = useState([]);
    const [voucher, setVoucher] = useState("");

    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [change, setChange] = useState<boolean>(false);
    const [mess, setMess] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);

    const changeVoucher = (code: string, submit: boolean) => {
        setStringData(storageKeys.PROMOTION_ERROR, "");
        setStringData(storageKeys.PROMOTION_SUCCESS, "");

        setVoucher(code);
        setCode(code);

        if (formRef.current) {
            formRef.current.setValues({ code: code });
        }

        if (submit) {
            onSubmitVoucher({ code: code });
        }
    };

    const getBaskets = (id: string) => {
        dispatch(basketActions.getBasket(id));
        dispatch(basketActions.checkStockBasket(id));
    };

    const promotionChecking = (actionrequest, onCompleted, onError) => {
        dispatch(
            promotionActions.checkPromotion({
                actionrequest,
                onCompleted,
                onError,
                onMess: (message: string) => {
                    setMess(message);
                },
            })
        );
    };

    const onSubmitVoucher = (value) => {
        setLoading(true);

        let actionrequest = {
            params: {
                code: value?.code,
                basketId: basketId,
                phoneNumber: user?.phone || null,
            },
            baskets: basketData,
        };

        console.log(actionrequest)

        let onCompleted = (res: any) => {
            setPromotion(res?.data);
            setObjectData(storageKeys.PROMOTION, res?.data);
            setStringData(storageKeys.PROMOTION_ERROR, "");
            setStringData(storageKeys.PROMOTION_SUCCESS, "Áp dụng voucher thành công");

            getBaskets(`${basketId}`);
            setLoading(false);
        };

        let onError = (err: any) => {
            if (err.length > 0) {
                setStringData(
                    storageKeys.PROMOTION_ERROR,
                    listErrorCodeVoucher[err[0].code] || "Không thể áp dụng voucher"
                );
            } else {
                setStringData(storageKeys.PROMOTION_ERROR, "Không thể áp dụng voucher");
            }
            setStringData(storageKeys.PROMOTION_SUCCESS, "");

            setObjectData(storageKeys.PROMOTION, {});

            setLoading(false);
        };

        promotionChecking(actionrequest, onCompleted, onError);
    };

    const checkAutoPromotion = (basketData) => {
        setLoading(true);
        setChange(true);
        let actionrequest = {
            params: {
                code: basketData?.voucher?.code,
                basketId: basketId,
                phoneNumber: user?.phone || null,
            },
            baskets: basketData,
        };

        let onCompleted = (res: any) => {
            setPromotion(res?.data);
            setObjectData(storageKeys.PROMOTION, res?.data);
            setStringData(storageKeys.PROMOTION_ERROR, "");
            setLoading(false);
            getBaskets(`${basketId}`);
        };

        let onError = (err: any) => {
            if (basketData?.voucher) {
                if (err.length > 0) {
                    setStringData(
                        storageKeys.PROMOTION_ERROR,
                        listErrorCodeVoucher[err[0].code] || "Không thể áp dụng voucher"
                    );
                } else {
                    setStringData(storageKeys.PROMOTION_ERROR, "Không thể áp dụng voucher");
                }

                dispatch(
                    basketActions.updateBasket({
                        id: basketData?.basketId,
                        params: {
                            ...basketData,
                            voucher: null,
                        },
                        onCompleted: (res: any) => {
                            if (res.success) {
                                getBaskets(res.data.basketId);
                            }
                        },
                        onError: (err: any) => {
                            toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                            dispatch(
                                basketActions.deleteBasket({
                                    params: { id: basketData?.basketId },
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
            } else {
                setStringData(storageKeys.PROMOTION_ERROR, "");
            }
            setStringData(storageKeys.PROMOTION_SUCCESS, "");

            setLoading(false);

            setPromotion({});
            setObjectData(storageKeys.PROMOTION, {});
        };

        promotionChecking(actionrequest, onCompleted, onError);
    };

    const getListVoucher = () => {
        dispatch(
            promotionActions.getListVoucher({
                params: {},
                onCompleted: (res: any) => {
                    if (isAuthenticated) {
                        setListCoupon(res?.data?.items);
                    } else {
                        let list = res?.data?.items.filter(
                            (item) => item.promotion?.allowAnonymous
                        );
                        setListCoupon(list);
                    }
                },
                onError: () => {},
            })
        );
    };

    const deleteVoucher = () => {
        setLoading(true);

        dispatch(
            promotionActions.deleteVoucher({
                baskets: basketData,
                onCompleted: (res: any) => {
                    getBaskets(res?.data?.basketId);
                    setChange(false);
                    setLoading(false);
                    setStringData(storageKeys.PROMOTION_SUCCESS, "");

                    formRef.current.setValues({ code: "" });
                    setStringData(storageKeys.PROMOTION_ERROR, "Đã xoá mã giảm giá!");

                    setVoucher("");
                },
                onError: (err: any) => {
                    setLoading(false);
                    setStringData(storageKeys.PROMOTION_SUCCESS, "");
                    setStringData(
                        storageKeys.PROMOTION_ERROR,
                        "Không thành công, vui lòng thử lại sau!"
                    );
                },
            })
        );
    };

    useEffect(() => {
        getListVoucher();
    }, []);

    useEffect(() => {
        if (!isEmptyObject(basketData)) {
            if (!change) {
                checkAutoPromotion(basketData);
            }

            setCode(basketData?.voucher?.code || "");
        }
    }, [basketData, change, getObjectData(storageKeys.PROMOTION)]);

    const renderCurrentVoucher = useMemo(() => {
        if (
            getObjectData(storageKeys.PROMOTION) &&
            !isEmptyObject(getObjectData(storageKeys.PROMOTION))
        ) {
            return (
                <div className={styles.currentVoucher}>
                    Mã giảm giá đang áp dụng:
                    <div className={styles.item}>
                        <div className={styles.row}>
                            <div className={styles.tag}>
                                {code !== "" ? code : "ƯU ĐÃI CỬA HÀNG"}
                                {/* <span>(Còn 246)</span> */}
                            </div>
                            {code !== "" && <button onClick={deleteVoucher}>Xóa</button>}
                        </div>
                        <div className={styles.des}>
                            {getObjectData(storageKeys.PROMOTION).promotionName}{" "}
                            {code !== "" ? null : "- Chương trình tự động áp dụng"}
                        </div>
                    </div>
                </div>
            );
        } else {
            return;
        }
    }, [code, getObjectData(storageKeys.PROMOTION)]);

    return (
        <div className={styles.voucherForm}>
            {listCoupon.length > 0 && (
                <div className={styles.voucherList}>
                    {listCoupon?.map((item: any, key: number) => item.promotion?.isPublic && (
                        <CouponTag
                            key={`voucher_form_${key}`}
                            onClick={() => changeVoucher(item.code, true)}
                            isDisabled={item.code === code}
                            title={item.code}
                            availableQuantity={item.availableQuantity}
                            description={item?.promotion?.description}
                        />
                    ))}
                </div>
            )}
            {renderCurrentVoucher}
            <BasicForm
                initialValues={{
                    code: "",
                }}
                onSubmit={onSubmitVoucher}
                formikRef={formRef}
            >
                <InputTextField
                    placeholder="Nhập mã giảm giá"
                    name="code"
                    className={classNames(styles.fieldInput, {
                        [styles.error]:
                            getStringData(storageKeys.PROMOTION_ERROR) &&
                            getStringData(storageKeys.PROMOTION_ERROR) !== "",
                    })}
                    onChange={changeVoucher}
                />
                <Button
                    type="submit"
                    buttonStyle="secondary"
                    className={classNames(styles.btn, {
                        [styles.disable]: voucher === "" || loading,
                    })}
                >
                    Áp dụng
                </Button>
            </BasicForm>
            {getStringData(storageKeys.PROMOTION_ERROR) !== "" && (
                <div className={styles.errorMessage}>
                    {getStringData(storageKeys.PROMOTION_ERROR)}
                </div>
            )}
            {getStringData(storageKeys.PROMOTION_SUCCESS) !== "" && (
                <div className={styles.successMessage}>
                    {getStringData(storageKeys.PROMOTION_SUCCESS)}
                </div>
            )}
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

export default VoucherForm;
