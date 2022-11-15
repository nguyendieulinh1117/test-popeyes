import React from "react";
import classNames from "classnames";
import IconVip from "@assets/icons/vip.svg";
import IconCOD from "@assets/icons/cod.svg";
import IconTag from "@assets/icons/tag.svg";
import IconReturn from "@assets/icons/return.svg";

import styles from "./ProductPolicy.module.scss";

type ProductPolicyPropTypes = {
    className?: string;
    classNameItem?: string;
};

const ProductPolicy = ({ className }: ProductPolicyPropTypes) => {
    return (
        <div className={classNames(styles.productPolicy, className)}>
            <div className={styles.policyItem}>
                <figure>
                    <IconVip />
                </figure>
                <figcaption>
                    <h3>Đăng ký thành viên</h3>
                    <p>
                        Ưu đãi dành cho <span>thành viên VMStyle</span>{" "}
                    </p>
                </figcaption>
            </div>
            <div className={styles.policyItem}>
                <figure>
                    <IconCOD />
                </figure>
                <figcaption>
                    <h3>Thanh toán COD</h3>
                    <p>
                        Thanh toán khi <span>nhận hàng (COD)</span>
                    </p>
                </figcaption>
            </div>
            {/* <div className={styles.policyItem}>
                <figure>
                    <IconTag />
                </figure>
                <figcaption>
                    <h3>Hỗ trợ phí ship</h3>
                    <p>
                        15k cho đơn hàng <span>từ 150k</span> và 30K cho đơn hàng{" "}
                        <span>300k trở lên</span>
                    </p>
                </figcaption>
            </div> */}
            <div className={styles.policyItem}>
                <figure>
                    <IconReturn />
                </figure>
                <figcaption>
                    <h3>Đổi trả hàng</h3>
                    <p>
                        Đổi trả trong vòng 7 ngày miễn phí tại tất cả cửa hàng Vmstyle
                        và có thu phí ship đối với đổi trả Online.
                    </p>
                </figcaption>
            </div>
        </div>
    );
};

export default ProductPolicy;

