import React from "react";

import styles from "./InfoStore.module.scss";
import { MarkerType } from "./Map";
type InfoType = {
    info: MarkerType;
};
const InfoStore = ({ info }: InfoType) => {
    return (
        <div className={styles.info}>
            <h4>{info?.name}</h4>
            <p>{info?.address}</p>
            <p>Số điện thoại: {info?.phoneNumber}</p>
            <p>
                Giờ mở cửa: {info?.openTime} - {info?.closeTime}
            </p>
        </div>
    );
};

export default InfoStore;
