import React, { useEffect, useState } from "react";
import OrderFailPage from "@@OrderStatus/OrderFail";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { orderActions } from "@redux/actions";
import { toast } from "react-toastify";
import Notfound404 from "@hocs/Notfound404";

const OrderFail = () => {
    const dispatch = useDispatch();
    const { query } = useRouter();

    const [orderDetail, setOrderDetail] = useState<any>();

    useEffect(() => {
        if (!query.orderId) {
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
                    if (res.success) {
                        setOrderDetail(res.data);
                    } else {
                        toast.error("Đơn hàng không tồn tại");
                    }
                },
                onError: () => {
                    toast.error("Đơn hàng không tồn tại");
                },
            })
        );
    }, []);
    return (
        <Notfound404 condition={!!query.orderId}>
            <OrderFailPage detail={orderDetail} />
        </Notfound404>
    );
};

export default OrderFail;
