import React, { useState, useRef } from "react";
import classNames from "classnames";
import { Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import useDevices from "@hooks/useDevices";
import ProductItem from "@@@ProductItem";
import Button from "@@@Form/Button";

import styles from "./ProductRelated.module.scss";

const ProductRelated = ({ data }: any) => {
    const { isMobile } = useDevices();
    const listData = data?.relatedProducts;
    const tempData1 = [...listData];
    const tempData2 = [...listData];
    const [load, setLoad] = useState<number>(2);
    return (
        <div className={styles.productRelated}>
            <div className={styles.box}>
                <div className={styles.title}>
                    <h3>Sản phẩm liên quan</h3>
                </div>
                {isMobile ? (
                    <>
                        <div className={styles.mobileBox}>
                            {tempData1?.slice(0, load)?.map((value: any, key: number) => {
                                if (isMobile && key >= 6) return;
                                return (
                                    <div key={key} className={styles.swiperItem}>
                                        <ProductItem
                                            data={value}
                                            key={key}
                                            isLike={false}
                                            className={styles.productCol}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {tempData2?.slice(0, load).length < listData.length && (
                            <div className={styles.btn}>
                                <Button onClick={() => setLoad(load + 2)}>Xem thêm</Button>
                            </div>
                        )}
                    </>
                ) : (
                    <Swiper
                        className={styles.mySwiper}
                        modules={[Navigation, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={5}
                        navigation={true}
                        loop={false}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                    >
                        {data?.relatedProducts?.map((value: any, key: number) => (
                            <SwiperSlide key={key}>
                                <div className={styles.swiperItem}>
                                    <ProductItem
                                        data={value}
                                        key={key}
                                        isLike={false}
                                        className={styles.productCol}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default ProductRelated;
