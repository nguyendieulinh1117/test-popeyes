import { useSelectorTyped } from "@hooks/useSelectorType";
import React from "react";
import ListCart from "./ListCart";

import styles from "./MainCart.module.scss";
import Payment from "./Payment";

const MainCart = ({ basketData }: any) => {
    return (
        <div className={styles.cartMain}>
            <ListCart data={basketData} />
            <Payment data={basketData} />
        </div>
    );
};

export default MainCart;
