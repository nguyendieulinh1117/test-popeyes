import React, { useEffect, useState } from "react";
import OrderSuccessPage from "@@OrderStatus/OrderSuccess";
import { useDispatch } from "react-redux";
import { authActions, orderActions } from "@redux/actions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import LoginModal from "@components/Authencation/LoginModal";
import Loading from "@@@Loading";
import Notfound404 from "@hocs/Notfound404";
import OrderFailPage from "@@OrderStatus/OrderFail";

const OrderSuccess = () => {
    const dispatch = useDispatch();
    const { query } = useRouter();
    const { isAuthenticated } = useAuth();

    const [orderDetail, setOrderDetail] = useState<any>({});
    const [isShow, setIsShow] = React.useState<boolean>(false);
    const [isNotfound, setIsNotfound] = React.useState<boolean>(true);
    const [isShowLogin, setIsShowLogin] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    useEffect(() => {
        if (!query.orderId) {
            setIsShow(true);
            return;
        }
        dispatch(
            orderActions.getOrderByCode({
                params: {
                    id: query.orderId?.includes("_Repay")
                        ? query.orderId?.slice(0, query.orderId?.indexOf("_Repay"))
                        : query.orderId,
                },
                onCompleted: (res: any) => {
                    setLoading(false);
                    if (res.success) {
                        setIsNotfound(true);
                        setOrderDetail(res.data);
                        if (!isAuthenticated) {
                            dispatch(
                                authActions.checkAccountExist({
                                    params: res.data?.customer?.phone,
                                    onCompleted: (res: any) => {
                                        setIsShowLogin(res?.data);
                                        setIsShow(true);
                                    },
                                    onError: () => {
                                        setIsShowLogin(false);
                                        setIsShow(true);
                                    },
                                })
                            );
                        }
                    } else {
                        toast.error("Đơn hàng không tồn tại");
                        setIsNotfound(false);
                    }
                },
                onError: () => {
                    setLoading(false);
                    toast.error("Đơn hàng không tồn tại");
                    setIsNotfound(false);
                },
            })
        );
    }, []);

    const payment = orderDetail?.payment;
    return (
        <Notfound404 condition={!!query.orderId && isNotfound}>
            {/* {payment?.paymentMethod !== "COD" && payment?.status === "Unpaid" ? (
                <OrderFailPage detail={orderDetail} />
            ) : ( */}
            <OrderSuccessPage detail={orderDetail} />
            {/* )} */}
            {isAuthenticated ? undefined : (
                <LoginModal isShow={isShow} setIsShow={setIsShow} isLogin={isShowLogin} />
            )}
            <Loading active={loading} />
        </Notfound404>
    );
};

export default OrderSuccess;
