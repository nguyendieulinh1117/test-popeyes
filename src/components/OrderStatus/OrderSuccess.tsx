import React, { useEffect, useState } from "react";

import styles from "./OrderSuccess.module.scss";

import OrderStatus from ".";
import { Desktop, Mobile } from "@@@Media";
import { useRouter } from "next/router";
import { paths, storageKeys } from "@constants";
import classNames from "classnames";
import Button from "@@@Form/Button";
import { useDispatch } from "react-redux";
import { orderActions, orderActionTypes, paymentActions } from "@redux/actions";
import { toast } from "react-toastify";
import BaseModal from "@components/Common/Modal";
import { useSelectorTyped } from "@hooks/useSelectorType";
import Loading from "@@@Loading";
import { purchaseFunc } from "@utils/measureEcommerceGA";
import { getStringData, setStringData } from "@utils/localStorage";

const OrderSuccess: React.FC<any> = ({ detail }) => {
    const shipping = detail?.shipping;
    const payment = detail?.payment;
    const router = useRouter();
    const dispatch = useDispatch();
    const { push } = useRouter();
    const [isShow, setIsShow] = useState<boolean>(true);
    const { [orderActionTypes.CHANGE_COD]: loading }: any = useSelectorTyped(
        (state) => state.loading
    );
    const onClickBtn = () => {
        typeof window !== "undefined" && router.push(`${paths.trackingOrder}/${detail?.code}`);
    };

    const setTimeOutPush = (paths: string, seconds: number = 500) => {
        setTimeout(() => {
            push(paths);
        }, seconds);
    };

    const rePayment = () => {
        dispatch(
            paymentActions.orderPayment({
                params: {
                    orderCode: detail?.code,
                    paymentMethod: payment?.paymentMethod,
                    redirectUrl: `${window.location.origin}${paths.orderSuccess}`,
                },
                onCompleted: (res: any) => onCompletePostPayment(res, detail),
                onError: () => {
                    onErrorOrder();
                    setTimeOutPush(`${paths.orderFail}?orderId=${detail.code}`);
                },
            })
        );
    };

    const changeCOD = () => {
        dispatch(
            orderActions.changeCOD({
                params: {
                    code: detail?.code,
                },
                onCompleted: (res: any) => {
                    setIsShow(false);
                    purchaseFunc(detail)
                    window.location.assign(
                        `${window.location.origin}${paths.orderSuccess}?orderId=${detail.code}`
                    );
                },
                onError: (err: any) => {
                    setIsShow(false);
                    toast.error(err.errors[0].message);
                },
            })
        );
    };
    const onErrorOrder = () => {
        toast.error("???? x???y ra l???i khi thanh to??n.");
    };

    const onCompletePostPayment = (res: any, orderDetail: any) => {
        if (!res.success) {
            onErrorOrder();
            setTimeOutPush(`${paths.orderFail}?orderId=${orderDetail.code}`);
            return;
        }
        const paymentDetail = res.data;
        const { payUrl, paymentMethod, qrCodeUrl, amount } = paymentDetail;

        if (paymentMethod?.code === "COD") {
            purchaseFunc(orderDetail)
            push(`${paths.orderSuccess}?orderId=${orderDetail.code}`);
        } else if (paymentMethod?.code === "ShopeePay") {
            push(`shopeepay?qrCode=${qrCodeUrl}&code=${orderDetail.code}&amount=${amount}`);
        } else {
            push(payUrl);
        }
    };

    useEffect(() => {
        if (detail?.status === "Cancelled") {
            setTimeOutPush(`${paths.orderCancel}?orderId=${detail.code}`);
        }
    }, [detail]);

    useEffect(() =>{
        if(detail?.status !== "Cancelled"){
            if(detail?.payment?.paymentMethod !== "COD" && payment?.status === "Paid"){
                if(!(getStringData(storageKeys.PURCHASED) && getStringData(storageKeys.PURCHASED) === "purchased")){
                    purchaseFunc(detail)
                    setStringData(storageKeys.PURCHASED, "purchased")
                }
            }
        }
    }, [detail, getStringData(storageKeys.PURCHASED)])

    return (
        <OrderStatus
            title="?????T H??NG TH??NH C??NG"
            isSuccess={true}
            text="Theo d??i ????n h??ng"
            orderDetail={detail}
            onClickBtn={onClickBtn}
        >
            <div className={styles.main}>
                <div className={styles.item}>
                    <p>
                        M?? ????n h??ng c???a b???n:<span>{detail?.code}</span>
                    </p>
                    <p>
                        M?? v???n ????n:<span>{detail?.shipping?.trackingCode}</span>
                    </p>
                    <Desktop>
                        <p>
                            Ph????ng th???c thanh to??n:{" "}
                            <span>
                                {detail?.payment?.paymentMethod === "COD"
                                    ? "Thanh to??n khi nh???n h??ng (COD)"
                                    : `Thanh to??n b???ng ${detail?.payment?.paymentMethod}`}
                            </span>
                        </p>
                    </Desktop>
                </div>
                <Mobile>
                    <div className={styles.item}>
                        <p> Ph????ng th???c thanh to??n:</p>
                        <span>{payment?.paymentMethod}</span>
                    </div>
                </Mobile>
                <div className={styles.item}>
                    <p>Tr???ng th??i thanh to??n:</p>
                    <span
                        className={classNames(styles.status, {
                            [styles.paid]: payment?.status !== "Unpaid",
                        })}
                    >
                        {payment?.status === "Unpaid" ? "Ch??a thanh to??n" : "???? thanh to??n"}
                        {/* {detail?.payment?.paymentMethod !== "COD" &&
                            payment?.status === "Unpaid" && (
                                <Button onClick={rePayment}>Thanh to??n l???i</Button>
                            )} */}
                    </span>
                </div>
                <div className={styles.item}>
                    <p>H??? v?? t??n ng?????i nh???n:</p>
                    <span>{shipping?.firstName}</span>
                </div>
                <div className={styles.item}>
                    <p>S??? ??i???n tho???i:</p>
                    <span>{shipping?.phone}</span>
                </div>
                <div className={styles.item}>
                    <p>?????a ch???:</p>
                    <span>{shipping?.address}</span>
                </div>
                <div className={styles.item}>
                    <p>Ghi ch??:</p>
                    <span>{detail?.note}</span>
                </div>
            </div>
            {detail?.payment?.paymentMethod !== "COD" && payment?.status === "Unpaid" && (
                <BaseModal
                    isOpen={isShow}
                    bodyClass={styles.modalBody}
                    confirmButtonLabel="Th??? l???i"
                    onConfirm={rePayment}
                    onCancel={changeCOD}
                    cancelButtonLabel="?????i COD"
                    headerClass={styles.modalHeader}
                    footerClass={styles.modalFooter}
                >
                    <div className={styles.modalTitle}>Th??ng b??o</div>
                    <br />
                    Thanh to??n ????n h??ng ???? b??? hu???
                    <br />
                    B???n c?? mu???n thanh to??n l???i?
                </BaseModal>
            )}
            {loading && <Loading active={loading} />}
        </OrderStatus>
    );
};

export default OrderSuccess;
