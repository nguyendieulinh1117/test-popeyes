import BaseModal from "@components/Common/Modal";
import React, { useState } from "react";
import ItemStore from "./ItemStore";
import styles from "./ListStore.module.scss";

const ListStore = ({ provinceStores, handleClickMarker }: any) => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <div className={styles.listStore}>
            {provinceStores?.map((provinceStore: any, key: number) =>
                provinceStore?.stores.length > 0 ? (
                    <div className={styles.itemArea} key={`province_${key}`}>
                        <h3 className={styles.title}>{provinceStore.name}</h3>
                        {provinceStore?.stores?.map((item: any, index: number) => (
                            <div className={styles.list} key={`store_${index}`}>
                                <ItemStore
                                    store={item}
                                    handleClickMarker={handleClickMarker}
                                    setShow={setShow}
                                />
                            </div>
                        ))}
                    </div>
                ) : undefined
            )}
            <BaseModal
                isOpen={show}
                onClose={() => {
                    setShow(false);
                }}
                bodyClass={styles.modalBody}
                confirmButtonLabel="Đã hiểu"
                onConfirm={() => {
                    setShow(false);
                }}
                headerClass={styles.modalHeader}
                footerClass={styles.modalFooter}
            >
                <div className={styles.modalTitle}>
                    <p>Vui lòng nhập địa chỉ của bạn!</p>
                </div>
            </BaseModal>
        </div>
    );
};

export default ListStore;
