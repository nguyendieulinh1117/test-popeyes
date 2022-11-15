import React, { useState } from "react";
import Button from "@@@Form/Button";
import styles from "./ItemStore.module.scss";
import IconLocation from "@assets/icons/location.svg";
import IconDirection from "@assets/icons/directions.svg";

import { getObjectData } from "@utils/sessionStorage";
import { storageKeys } from "@constants";
const ItemStore = ({ store, handleClickMarker, setShow }: any) => {
    const handleDirection = (store) => {
        if (getObjectData(storageKeys.POSITION)) {
            const data = getObjectData(storageKeys.POSITION);
            window.location.assign(
                `https://www.google.com/maps/dir/${data.address}/${store.address}/@${data.lat},${data.lng}/@${store.lat},${store.lng}`
            );
        } else {
            setShow(true);
        }
    };
    return (
        <div className={styles.itemStore}>
            <div className={styles.main}>
                <div className={styles.infoWrap}>
                    <h4 className={styles.name}>{store.name}</h4>
                    <div className={styles.info}>
                        <p>{store.address}</p>
                        <p>Số điện thoại: {store.phoneNumber}</p>
                    </div>
                </div>
                <div className={styles.btnWrap}>
                    <Button className={styles.btnDirect} onClick={() => handleDirection(store)}>
                        <IconDirection />
                        Đường đi
                    </Button>
                    <Button className={styles.btn} onClick={() => handleClickMarker(store)}>
                        <IconLocation />
                        Tìm trên bản đồ
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ItemStore;
