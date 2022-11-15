import React from "react";

import styles from "./Empty.module.scss";
const Empty = ({ isAuth, setShow }: any) => {
    return (
        <div className={styles.empty}>
            <img src="/images/empty-cart.png" alt="empty cart" />
            <h3 className={styles.content}>
                Giỏ hàng của bạn trống
                {!isAuth && <button onClick={() => setShow(true)}>Đăng nhập / Đăng ký</button>}
            </h3>
        </div>
    );
};

export default Empty;
