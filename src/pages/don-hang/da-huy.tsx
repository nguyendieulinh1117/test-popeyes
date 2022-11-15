import React, { useEffect, useState } from "react";
import OrderCancelPage from "@@OrderStatus/OrderCancel";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { orderActions } from "@redux/actions";
import { toast } from "react-toastify";
import Notfound404 from "@hocs/Notfound404";

const OrderCancel = () => {
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
            <OrderCancelPage detail={orderDetail} />
        </Notfound404>
    );
};

export default OrderCancel;
