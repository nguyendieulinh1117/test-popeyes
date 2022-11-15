import React from "react";

import styles from "./index.module.scss";
const Empty = ({ isAuth, setShow }: any) => {
    return (
        <div className={styles.empty}>
            <img src="/images/empty-cart.png" alt="empty cart" />
            <h3 className={styles.content}>Hiện tại không có sản phẩm nào!</h3>
        </div>
    );
};

export default Empty;
