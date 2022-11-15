import React from "react";
import OrderStatus from ".";
import styles from "./OrderFail.module.scss";
const OrderFail: React.FC<any> = ({detail}) => {
    return (
        <OrderStatus title="RẤT TIẾC, ĐÃ XẢY RA LỖI!" text="Quay lại giỏ hàng" orderDetail={detail}>
            <div className={styles.item}>Thông tin chi tiết lỗi</div>
        </OrderStatus>
    );
};

export default OrderFail;
