import React from "react";
import Breadcrumbs from "@@@Breadcrumbs";
import styles from "./index.module.scss";
import Link from "next/link";
import { paths } from "@constants";
const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Điều khoản VM Style",
        active: true,
    },
];
const Policies = () => {
    return (
        <div className={styles.policy}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>Điều khoản VM Style</h3>
                    </div>
                    <div className={styles.content}>
                        <h4>Điều khoản tổng quát</h4>
                        <ul>
                            <li>
                                <Link href={paths.policyPayment}>Chính sách thanh toán</Link>
                            </li>
                            <li>
                                <Link href={paths.policyReturn}>Chính sách bảo hành, đổi trả</Link>
                            </li>
                            <li>
                                <Link href={paths.policyShipping}>Chính sách giao, nhận hàng và kiểm hàng</Link>
                            </li>
                            <li>
                                <Link href={paths.policySecret}>Chính sách bảo mật thông tin</Link>
                            </li>
                            <li>
                                <Link href={paths.policyPurchase}>Chính sách mua hàng</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Policies;
