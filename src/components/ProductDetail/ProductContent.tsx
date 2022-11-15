import React, { useState, useRef } from "react";
import classNames from "classnames";
import useDevices from "@hooks/useDevices";

import CompactContent from "@@@CompactContent";

import styles from "./ProductContent.module.scss";

const ProductContent = ({contentData}: any) => {
    const { isMobile } = useDevices();

    return (
        <div className={styles.productContent}>
            <div className={styles.title}>
                <h3>THÔNG TIN CHI TIẾT</h3>
            </div>
            <div className={styles.content}>
                <CompactContent
                    compactHeight={isMobile ? 560 :700 }
                    toggleButtonLabelMore="Xem thêm"
                >
                    <article dangerouslySetInnerHTML={{ __html: contentData }} />
                </CompactContent>
            </div>
        </div>
    );
}

export default ProductContent;