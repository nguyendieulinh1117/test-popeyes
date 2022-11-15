import React from "react";
import CartItem from "./CartItem";
import classNames from "classnames";
import styles from "./ListCart.module.scss";
import { Mobile } from "@@@Media";
import CartItemCombo from "./CartItemCombo";

const ListCart = ({ data }: any) => {
    return (
        <div className={styles.listCart}>
            <h3 className={styles.titleCart}>
                GIỎ HÀNG CỦA BẠN<Mobile> ({data?.products?.length + data?.combos?.length})</Mobile>
            </h3>
            <div className={styles.titleList}>
                <div className={styles.prodCart}>
                    SẢN PHẨM ({data?.products?.length + data?.combos?.length})
                </div>
                <div className={styles.figureCart}>
                    <div className={styles.figureItem}>SỐ LƯỢNG</div>
                    <div className={styles.figureItem}>ĐƠN GIÁ</div>
                    <div className={styles.figureItem}>TỔNG TIỀN</div>
                </div>
            </div>
            <div className={styles.listMain}>
                {data?.combos?.map((item: any, index: number) => (
                    <CartItemCombo item={item} key={index} index={index} />
                ))}

                {data?.products?.map((item: any, index: number) => (
                    <CartItem item={item} key={index} index={index} />
                ))}
                {data?.bonusProducts?.length > 0 &&
                    data?.bonusProducts?.map(
                        (item: any, index: number) => (
                            <CartItem
                                item={item} 
                                key={index} 
                                index={index}
                                type="gift"
                            />
                        )
                    )
                }
            </div>
        </div>
    );
};

export default ListCart;
