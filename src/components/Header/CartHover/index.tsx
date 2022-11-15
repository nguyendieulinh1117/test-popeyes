import React, { useState } from "react";
import classNames from "classnames";

import Empty from "./Empty";
import List from "./List";
import Login from "./Login";

import styles from "./index.module.scss";
import useAuth from "@hooks/useAuth";
import { isEmptyObject } from "@utils";

const CartHover = ({ setShow, className, data }: any) => {
    const { isAuthenticated } = useAuth();
    
    return (
        <div className={classNames(styles.cartHover, className)}>
            {isEmptyObject(data) || (data?.products?.length <= 0 && data?.combos?.length <=0) ? (
                <Empty />
            ) : (
                <>
                    {!isAuthenticated && <Login setShow={setShow} />}
                    <List data={data} isAuth={isAuthenticated} />
                </>
            )}
        </div>
    );
};

export default CartHover;
