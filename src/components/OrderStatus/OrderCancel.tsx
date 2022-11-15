import React from "react";
import OrderStatus from ".";

const OrderCancel: React.FC<any> = ({detail}) => {
    return <OrderStatus title="ĐƠN HÀNG ĐÃ HỦY" text="Quay lại giỏ hàng" orderDetail={detail}/>;
};

export default OrderCancel;
