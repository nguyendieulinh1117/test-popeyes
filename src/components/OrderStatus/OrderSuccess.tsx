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
        toast.error("Đã xảy ra lỗi khi thanh toán.");
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
            title="ĐẶT HÀNG THÀNH CÔNG"
            isSuccess={true}
            text="Theo dõi đơn hàng"
            orderDetail={detail}
            onClickBtn={onClickBtn}
        >
            <div className={styles.main}>
                <div className={styles.item}>
                    <p>
                        Mã đơn hàng của bạn:<span>{detail?.code}</span>
                    </p>
                    <p>
                        Mã vận đơn:<span>{detail?.shipping?.trackingCode}</span>
                    </p>
                    <Desktop>
                        <p>
                            Phương thức thanh toán:{" "}
                            <span>
                                {detail?.payment?.paymentMethod === "COD"
                                    ? "Thanh toán khi nhận hàng (COD)"
                                    : `Thanh toán bằng ${detail?.payment?.paymentMethod}`}
                            </span>
                        </p>
                    </Desktop>
                </div>
                <Mobile>
                    <div className={styles.item}>
                        <p> Phương thức thanh toán:</p>
                        <span>{payment?.paymentMethod}</span>
                    </div>
                </Mobile>
                <div className={styles.item}>
                    <p>Trạng thái thanh toán:</p>
                    <span
                        className={classNames(styles.status, {
                            [styles.paid]: payment?.status !== "Unpaid",
                        })}
                    >
                        {payment?.status === "Unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}
                        {/* {detail?.payment?.paymentMethod !== "COD" &&
                            payment?.status === "Unpaid" && (
                                <Button onClick={rePayment}>Thanh toán lại</Button>
                            )} */}
                    </span>
                </div>
                <div className={styles.item}>
                    <p>Họ và tên người nhận:</p>
                    <span>{shipping?.firstName}</span>
                </div>
                <div className={styles.item}>
                    <p>Số điện thoại:</p>
                    <span>{shipping?.phone}</span>
                </div>
                <div className={styles.item}>
                    <p>Địa chỉ:</p>
                    <span>{shipping?.address}</span>
                </div>
                <div className={styles.item}>
                    <p>Ghi chú:</p>
                    <span>{detail?.note}</span>
                </div>
            </div>
            {detail?.payment?.paymentMethod !== "COD" && payment?.status === "Unpaid" && (
                <BaseModal
                    isOpen={isShow}
                    bodyClass={styles.modalBody}
                    confirmButtonLabel="Thử lại"
                    onConfirm={rePayment}
                    onCancel={changeCOD}
                    cancelButtonLabel="Đổi COD"
                    headerClass={styles.modalHeader}
                    footerClass={styles.modalFooter}
                >
                    <div className={styles.modalTitle}>Thông báo</div>
                    <br />
                    Thanh toán đơn hàng đã bị huỷ
                    <br />
                    Bạn có muốn thanh toán lại?
                </BaseModal>
            )}
            {loading && <Loading active={loading} />}
        </OrderStatus>
    );
};

export default OrderSuccess;
