import { commonKeys, paths } from "@constants";
import useDynamicContent from "@hooks/useDynamicContent";
import Link from "next/link";
import React from "react";

import styles from "./Contact.module.scss";
const Contact = ({ cart = false }: any) => {
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    return (
        <div className={styles.contact}>
            {cart && (
                <>
                    <span>CSKH: {contenValue?.phoneTakeCare}</span>
                    <span>CHÍNH SÁCH VẬN CHUYỂN</span>
                    <span>QUY ĐỊNH ĐỔI TRẢ</span>
                </>
            )}
            {!cart && (
                <span>
                    Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
                    <Link href={paths.policies}>Điều khoản</Link> VM Style
                </span>
            )}
        </div>
    );
};

export default Contact;
