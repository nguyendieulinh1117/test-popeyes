import React from "react";
import styles from "./index.module.scss";
import OrderLayout from "@@@OrderLayout";
import Button from "@components/Common/Form/Button";
import { useRouter } from "next/router";
import { commonKeys, paths } from "@constants";
import classNames from "classnames";
import { Desktop, Mobile } from "@@@Media";
import useDynamicContent from "@hooks/useDynamicContent";

type OrderStatusType = {
    children?: any;
    title: string;
    text: string;
    isSuccess?: boolean;
    orderDetail?: any;
    onClickBtn?: Function; 
};
const OrderStatus = ({ children, title, text, isSuccess = false, orderDetail, onClickBtn}: OrderStatusType) => {
    const {push} = useRouter();
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    return (
        <OrderLayout style="secondary" orderItems = {orderDetail} >
            <div className={styles.infoWrap}>
                <h3 className={styles.title}>{title}</h3>
                {children}
            </div>
            <div className={styles.actionWrap}>
                <div className={styles.contact}>
                    {isSuccess && <p>Cảm ơn bạn đã mua hàng tại VM style!</p>}

                    <Desktop>
                        <p>
                            Nếu bạn cần hỗ trợ, vui lòng liên hệ <span>CSKH: {contenValue?.phoneTakeCare}</span>
                        </p>
                    </Desktop>
                    <Mobile>
                        <p>
                            Nếu bạn cần hỗ trợ, vui lòng liên hệ <br />
                            <span>CSKH: {contenValue?.phoneTakeCare}</span>
                        </p>
                    </Mobile>
                </div>
                <div className={styles.btnGroup}>
                    <Button
                        buttonStyle="secondary"
                        className={classNames(styles.btn, { [styles.btnSuccess]: isSuccess })}
                        onClick={onClickBtn? ()=> onClickBtn(): ()=> push(paths.cart)}
                    >
                        {text}
                    </Button>
                    {isSuccess && (
                        <Button
                            className={classNames(styles.btn, { [styles.btnSuccess]: isSuccess })}
                            onClick={() => push(paths.home)}
                        >
                            Quay lại trang chủ
                        </Button>
                    )}
                </div>
            </div>
        </OrderLayout>
    );
};

export default OrderStatus;
