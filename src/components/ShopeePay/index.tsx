import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import moment from "moment";

import { formatPrice } from "@utils";
import { useSelectorTyped } from "@hooks/useSelectorType";

import styles from "./index.module.scss";

const TIME_LEFT = 600;

const ShopeePay = () => {
    const router: any = useRouter();
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(TIME_LEFT);
    const {orderDetail} = useSelectorTyped((state) => state.order);
    const codeId = router?.query?.code;

    const getTimeLeft = (timeLeft: any) => {
        return new Date(timeLeft * 1000).toISOString().substr(14, 5);
    };


    useEffect(() => {
        if (timeLeft > 0) {
            setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else {
            router.push("/order-status/fail");
        }
    }, [timeLeft]);


    return (
        <div className={styles.shopeepay}>
            <div className={styles.header}>
                <div className={`container ${styles.header_main}`}>
                    <div className={styles.logo}>
                        <img src="/images/shopeePay/logo-shopeepay.png" alt="logo" />
                        <div className={styles.title}>Welcome to use ShopeePay</div>
                    </div>
                    <div className={styles.language}>
                        <p className={`${styles.vn}`}>VN</p>
                        <p className={`${styles.active}`}>EN</p>
                    </div>
                </div>
            </div>
            <div className={`container ${styles.bottom}`}>
                <div className={styles.main}>
                    <div className={styles.order_detail}>
                        <div className={styles.title}>Order Details</div>
                        <div className={styles.item}>
                            <p>Order ID</p>
                            <p>{codeId}</p>
                        </div>
                        <div className={styles.item}>
                            <p>Amount</p>
                            <p className={styles.amount}>
                                {formatPrice(router?.query?.amount|| 0)}{" "}
                                <span className={styles.symbol}>đ</span>
                            </p>
                        </div>
                    </div>
                    <div className={styles.scan_qr}>
                        <div className={styles.qr_code}>
                            <p>
                                QR code expires <span> {`${getTimeLeft(timeLeft)}`}</span>
                            </p>
                            <div className={styles.qr_code_main}>
                                <div className={styles.qr_code_img}>
                                    <img src={router?.query?.qrCode} alt="qr" />
                                    <div className={styles.img_absolute}>
                                        <img src="/images/shopeePay/e-wallet.png" alt="wallet" />
                                    </div>
                                </div>
                                <div className={styles.content_bottom}>
                                    Use ShopeePay or Shopee scanner to scan
                                </div>
                            </div>
                        </div>
                        <div className={styles.how_to_scan}>
                            <p>How to scan</p>
                            <img src="/images/shopeePay/guide_download_vn.d5a094b6.png" alt="guide" />
                        </div>
                        <div className={styles.footer}>
                            <div className={styles.footer_item}>
                                <div className={styles.mail}>
                                    <p>Email</p>
                                    <span className={styles.card_border}></span>
                                    <p>hotro@shopeepay.com</p>
                                </div>
                                <div className={styles.mail}>
                                    <p>Help Center</p>
                                    <span className={styles.card_border}></span>
                                    <a href="https://shopeepay.vn/faqs/qr-static-code/#huong-dan-quet-ma-qr-khi-thanh-toan-tren-website">
                                        FAQ
                                    </a>
                                </div>
                            </div>
                            <div className={styles.footer_item}>
                                <img src="/assets/img/credit-card.png" alt="" />
                            </div>
                            <div className={styles.footer_item}>
                                <img src="/assets/img/bank.png" alt="" />
                            </div>
                            <div className={styles.footer_item}>
                                <p className={styles.copyright}>
                                    © {moment().format("YYYY")} AirPay Joint Stock Company. All
                                    rights reserved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopeePay;
