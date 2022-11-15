import React from "react";

import Button from "@@@Form/Button";
import classNames from "classnames";
import styles from "./EmptyCart.module.scss";
import { useRouter } from "next/router";
import { paths } from "@constants";

const EmptyCart = () => {
    const router = useRouter();
    return (
        <div className={styles.empty}>
            <div className={styles.emptyTitle}>GIỎ HÀNG CỦA BẠN</div>
            <div className={styles.emptyText}>Giỏ hàng của bạn không có sản phẩm nào.</div>
            <Button
                className={styles.emptyBtn}
                buttonStyle="secondary"
                onClick={() => router.back()}
            >
                Quay lại cửa hàng
            </Button>
        </div>
    );
};

export default EmptyCart;
