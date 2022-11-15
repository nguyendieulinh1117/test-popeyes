import React, { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { orderActions, paymentActions } from "@redux/actions";

import useAuth from "@hooks/useAuth";
import { Desktop, Mobile } from "@@@Media";
import { paths } from "@constants";

import BasicForm from "@@@Form/BasicForm";
import InputTextField from "@@@Form/InputTextField";
import BaseModal from "@@@Modal";
import ProductListTable from "./ProductListTable";
import Timeline from "./Timeline";
import IconArrowLeft from "@assets/icons/arrow-left.svg";
import IconLeft from "@assets/icons/arrow-left.svg";

import classNames from "classnames";
import style from "./index.module.scss";
import Button from "@components/Common/Form/Button";
import CachedImage from "@components/Common/CachedImage";
import ShopeeIcon from "@assets/icons/social-shopee.svg";
import FacebookIcon from "@assets/icons/social-face.svg";
import InstagramIcon from "@assets/icons/social-ins.svg";
import LazadaIcon from "@assets/icons/social-lazada.svg";
import ZaloIcon from "@assets/icons/social-zalo.svg";
import WhatsappIcon from "@assets/icons/social-whatsapp.svg";
import TiktokIcon from "@assets/icons/social-tiktok.svg";
import { useRouter } from "next/router";

const DetailOrder = ({ orderDetail, tracking = false }: any) => {
    const dispatch = useDispatch();

    const { isAuthenticated } = useAuth();
    const { push } = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const [isShowRepay, setIsShowRepay] = useState<boolean>(true);

    const renderStatus = useMemo(() => {
        if (orderDetail?.status === "Pending") {
            return "CHỜ XÁC NHẬN";
        } else if (orderDetail?.status === "Processing" || orderDetail?.status === "Preparing") {
            return "ĐANG XỬ LÝ";
        } else if (orderDetail?.status === "Shipping") {
            return "ĐANG GIAO HÀNG";
        } else if (orderDetail?.status === "Completed" || orderDetail?.status === "Shipped") {
            return "HOÀN THÀNH";
        } else if (orderDetail?.status === "RequestCancel" || orderDetail?.status === "Cancelled") {
            return "ĐÃ HỦY";
        } else if (orderDetail?.status === "Closed") {
            return "ĐÃ KẾT THÚC";
        } else if (orderDetail?.status === "PaymentFailed") {
            return "THANH TOÁN THẤT BẠI";
        } else {
            return "";
        }
    }, [orderDetail?.status]);

    const validateForm = () => {
        let res: any = {
            note: Yup.string().required("Vui lòng nhập lý do hủy đơn"),
        };

        return res;
    };
    const onSumbitCancel = (values: any) => {
        handleCancelOrder(values.note, values.orderId);
    };
    const handleCancelOrder = (note: string, code: string) => {
        setShow(false);
        dispatch(
            orderActions.cancelOrder({
                params: { id: code, body: { reason: note } },
                onCompleted,
                onError,
            })
        );
    };

    const onCompleted = (res) => {
        if (res.success) {
            toast.success("Đơn hàng đang xác nhận hủy");
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    };
    const onError = (err) => {
        toast.error("Lỗi hủy đơn hàng");
    };
    const renderChannel = (channel: string) => {
        let data;
        if (channel === "Shopee") {
            data = (
                <p>
                    <ShopeeIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Facebook") {
            data = (
                <p>
                    <FacebookIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Lazada") {
            data = (
                <p>
                    <LazadaIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Instagram") {
            data = (
                <p>
                    <InstagramIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Tiki") {
            data = (
                <p>
                    <CachedImage src="/icons/social-tiki.png" width="24px" />
                    {channel}
                </p>
            );
        } else if (channel === "TikTok") {
            data = (
                <p>
                    <TiktokIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Whatsapp") {
            data = (
                <p>
                    <WhatsappIcon />
                    {channel}
                </p>
            );
        } else if (channel === "Zalo") {
            data = (
                <p>
                    <ZaloIcon />
                    {channel}
                </p>
            );
        } else if (channel === "ShopeeMall") {
            data = (
                <p>
                    <ShopeeIcon />
                    {channel}
                </p>
            );
        } else {
            data = (
                <p>
                    <CachedImage src="/logo.png" width="24px" />
                    {channel}
                </p>
            );
        }
        return data;
    };
    const setTimeOutPush = (paths: string, seconds: number = 500) => {
        setTimeout(() => {
            push(paths);
        }, seconds);
    };
    const onErrorOrder = () => {
        toast.error("Đã xảy ra lỗi khi thanh toán.");
    };
    const rePayment = () => {
        dispatch(
            paymentActions.orderPayment({
                params: {
                    orderCode: orderDetail?.code,
                    paymentMethod: orderDetail?.payment?.paymentMethod,
                    redirectUrl: `${window.location.origin}${paths.orderSuccess}`,
                },
                onCompleted: (res: any) => onCompletePostPayment(res, orderDetail),
                onError: () => {
                    onErrorOrder();
                    setTimeOutPush(`${paths.orderFail}?orderId=${orderDetail.code}`);
                },
            })
        );
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
            push(`${paths.orderSuccess}?orderId=${orderDetail.code}`);
        } else if (paymentMethod?.code === "ShopeePay") {
            push(`shopeepay?qrCode=${qrCodeUrl}&code=${orderDetail.code}&amount=${amount}`);
        } else {
            push(payUrl);
        }
    };

    const changeCOD = () => {
        dispatch(
            orderActions.changeCOD({
                params: {
                    code: orderDetail?.code,
                },
                onCompleted: (res: any) => {
                    setIsShowRepay(false);
                    window.location.assign(
                        `${window.location.origin}${paths.profile.detailOrder}/${orderDetail.code}`
                    );
                },
                onError: (err: any) => {
                    setIsShowRepay(false);
                    toast.error(err.errors[0].message);
                },
            })
        );
    };

    return (
        <div className={style.detailOrder}>
            <div className={style.header}>
                <div className={style.title}>
                    CHI TIẾT ĐƠN HÀNG
                    <Mobile>
                        <Link href={tracking ? paths.home : paths.profile.order.index} passHref>
                            <div className={style.returnBtn}>
                                <IconLeft />
                            </div>
                        </Link>
                    </Mobile>
                </div>
                <div className={style.info}>
                    <div className={style.code}>
                        Mã đơn hàng: <span>{orderDetail?.code}</span>
                    </div>
                    <div className={style.status}>{renderStatus}</div>
                </div>
            </div>
            <div className={style.body}>
                <div className={style.information}>
                    <div className={classNames(style.general, { [style.tracking]: tracking })}>
                        <div className={style.item}>
                            <div className={style.subTitle}>Địa chỉ người nhận</div>
                            <p>{orderDetail?.shipping?.firstName}</p>
                            <p>{orderDetail?.shipping?.phone}</p>
                            <p>{orderDetail?.shipping?.address}</p>
                        </div>
                        {
                            <div className={style.item}>
                                <div className={style.subTitle}>Mã vận đơn</div>
                                <p>
                                    <Link href={orderDetail?.shipping?.deliveryName === "GHN" ? `https://donhang.ghn.vn/?order_code=${orderDetail?.shipping?.trackingCode}` : `https://mysupership.vn/orders/tracking?ref=SuperShip&code=${orderDetail?.shipping?.trackingCode}`}>
                                        <a target="_blank"><i><u>{orderDetail?.shipping?.trackingCode}</u></i></a>
                                    </Link>
                                </p>
                            </div>
                        }

                        <div className={style.item}>
                            <div className={style.subTitle}>Phương thức thanh toán</div>
                            <p>
                                {orderDetail?.payment?.paymentMethod === "COD"
                                    ? "Thanh toán khi nhận hàng (COD)"
                                    : `Thanh toán bằng ${orderDetail?.payment?.paymentMethod}`}
                            </p>
                        </div>
                        <div className={style.item}>
                            <div className={style.subTitle}>Mua từ kênh bán hàng</div>
                            {renderChannel(orderDetail?.channelSource)}
                        </div>
                    </div>
                    <div className={style.timelineList}>
                        <Timeline status={orderDetail?.status} />
                    </div>
                </div>
                <ProductListTable data={orderDetail} />
            </div>
            <div className={classNames(style.footer, { [style.tracking]: tracking })}>
                {!tracking && (
                    <Link href={paths.profile.order.index} passHref>
                        <div className={style.return}>
                            <Desktop>
                                <IconArrowLeft />
                            </Desktop>
                            Quay lại đơn hàng của tôi
                        </div>
                    </Link>
                )}

                {(orderDetail?.status === "Preparing" || orderDetail?.status === "Processing") &&
                    isAuthenticated && (
                        <button
                            type="button"
                            className={style.cancleOrder}
                            onClick={() => setShow(true)}
                        >
                            Huỷ đơn hàng
                        </button>
                    )}
            </div>
            <BaseModal
                onClose={() => setShow(false)}
                isOpen={show}
                bodyClass={style.modalBody}
                headerClass={style.modalHeader}

                // onConfirm={() => handleCancelOrder(orderDetail?.id)}
            >
                <div className={style.modalTitle}>Bạn có chắc muốn hủy đơn hàng này?</div>
                <BasicForm
                    initialValues={{
                        note: "",
                        orderId: orderDetail?.code,
                    }}
                    validationSchema={Yup.object(validateForm())}
                    onSubmit={onSumbitCancel}
                    className={style.form}
                >
                    <InputTextField
                        textarea={true}
                        label="Lý do"
                        placeholder="Lý do hủy đơn"
                        name="note"
                        rows={3}
                        required
                    />
                    <Button buttonStyle="secondary" type="submit">
                        Xác nhận hủy
                    </Button>
                </BasicForm>
            </BaseModal>
            {orderDetail?.payment?.paymentMethod !== "COD" &&
                orderDetail?.payment?.status === "Unpaid" && (
                    <BaseModal
                        isOpen={isShowRepay}
                        bodyClass={style.modalBody}
                        confirmButtonLabel="Thử lại"
                        onConfirm={rePayment}
                        onCancel={changeCOD}
                        cancelButtonLabel="Đổi COD"
                        headerClass={style.modalHeader}
                        footerClass={style.modalFooter}
                    >
                        <div className={style.modalTitle1}>Thông báo</div>
                        <br />
                        Thanh toán đơn hàng đã bị huỷ
                        <br />
                        Bạn có muốn thanh toán lại?
                    </BaseModal>
                )}
        </div>
    );
};

export default DetailOrder;
