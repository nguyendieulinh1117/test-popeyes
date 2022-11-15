import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useSelectorTyped } from "@hooks/useSelectorType";
import useDynamicContent from "@hooks/useDynamicContent";
import { commonKeys, ssrMode, storageKeys } from "@constants";
import { EnumkeyCollections } from "@constants/enum";
import { getObjectData, setObjectData } from "@utils/sessionStorage";
import CachedImage from "@@@CachedImage";
import useDevices from "@hooks/useDevices";
import MetaWrapper from "@@@MetaWrapper";

import styles from "./index.module.scss";
import moment from "moment";
import Icon from '@assets/icons/logo.png';

const SwiperSlider = dynamic(() => import("./SwiperSlider"), { ssr: false });
const ProductStyle = dynamic(() => import("./ProductStyle"), { ssr: false });
const ProductTab = dynamic(() => import("./ProductTab"), { ssr: false });
const News = dynamic(() => import("./News"), { ssr: false });
const Modal = dynamic(() => import("../Common/Modal"), { ssr: false });

const Home: React.FC<any> = ({ productHouseWear }) => {
    const router = useRouter();
    const { isMobile } = useDevices();

    const [today, setToday] = useState(moment().format("DD-MM-YYYY hh:mm:ss a"));

    const { collectionNew, collectionBestSeller } = useSelectorTyped((state) => state.home);
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    const [showContentPopup, setShowContentPopup] = useState<boolean>(false);
    setInterval(() => {
        setToday(moment().format("DD-MM-YYYY hh:mm:ss a"));
    }, 10000);
    useEffect(() => {
        if (
            !getObjectData(storageKeys.CONTENT_DYNAMIC) ||
            getObjectData(storageKeys.CONTENT_DYNAMIC).count < 1
        ) {
            setShowContentPopup(true);
        }
    }, []);

    const handleClose = () => {
        setShowContentPopup(false);
        setObjectData(storageKeys.CONTENT_DYNAMIC, {
            ...contenValue,
            count: getObjectData(storageKeys.CONTENT_DYNAMIC)
                ? getObjectData(storageKeys.CONTENT_DYNAMIC).count + 1
                : 1,
        });
    };

    const handleClick = () => {
        router.push(contenValue?.popupUrl);
        setObjectData(storageKeys.CONTENT_DYNAMIC, {
            ...contenValue,
            count: getObjectData(storageKeys.CONTENT_DYNAMIC)
                ? getObjectData(storageKeys.CONTENT_DYNAMIC).count + 1
                : 1,
        });
    };
    
    return (
        <MetaWrapper
            meta = {{
                image: Icon.src
            }}
        >
            <div className={styles.home}>
                <SwiperSlider />
                {collectionNew &&
                    collectionNew?.isActive &&
                    moment(
                        moment(collectionNew?.from).format("DD-MM-YYYY hh:mm:ss a"),
                        "DD-MM-YYYY hh:mm:ss a"
                    ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
                    moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                        moment(
                            moment(collectionNew?.to).format("DD-MM-YYYY hh:mm:ss a"),
                            "DD-MM-YYYY hh:mm:ss a"
                        )
                    ) &&
                    collectionNew?.products?.length > 0 && (
                        <ProductStyle productData={collectionNew} />
                    )}
                {collectionBestSeller &&
                    collectionBestSeller?.isActive &&
                    moment(
                        moment(collectionBestSeller?.from).format("DD-MM-YYYY hh:mm:ss a"),
                        "DD-MM-YYYY hh:mm:ss a"
                    ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
                    moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                        moment(
                            moment(collectionBestSeller?.to).format("DD-MM-YYYY hh:mm:ss a"),
                            "DD-MM-YYYY hh:mm:ss a"
                        )
                    ) &&
                    collectionBestSeller?.products?.length > 0 && (
                        <ProductStyle
                            productData={collectionBestSeller}
                            classNameBox={styles.productHot}
                        />
                    )}
                {productHouseWear &&
                    productHouseWear?.isActive &&
                    moment(
                        moment(productHouseWear?.from).format("DD-MM-YYYY hh:mm:ss a"),
                        "DD-MM-YYYY hh:mm:ss a"
                    ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
                    moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                        moment(
                            moment(productHouseWear?.to).format("DD-MM-YYYY hh:mm:ss a"),
                            "DD-MM-YYYY hh:mm:ss a"
                        )
                    ) &&
                    productHouseWear?.children?.length > 0 && (
                        <ProductTab productData={productHouseWear} />
                    )}

                <News />
                {contenValue?.popupActive && (
                    <Modal
                        isOpen={showContentPopup}
                        contentClass={styles.modal}
                        headerClass={styles.modalHeader}
                        bodyClass={styles.modalBody}
                        onClose={handleClose}
                    >
                        <div className={styles.modalContent} onClick={handleClick}>
                            <CachedImage
                                src={
                                    isMobile
                                        ? contenValue?.popupImageMobile
                                        : contenValue?.popupImage
                                }
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </MetaWrapper>
    );
};

export default Home;
