import React, { useState } from "react";
import classNames from "classnames";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Magnifier from "react-magnifier";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/navigation";

import CachedImage from "@@@CachedImage";

import styles from "./ProductGallery.module.scss";
import { Desktop, Mobile } from "@components/Common/Media";

const ProductGallery = ({
    slideData,
    setImageOptionColor,
    imageOptionColor,
    mappingsData,
}: any) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    const onSlide = () => {
        setImageOptionColor("");
    };

    return (
        <div className={styles.productGallery}>
            <Swiper
                spaceBetween={10}
                navigation={true}
                slidesPerView={1}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.swiperBig}
            >
                {imageOptionColor === "" &&
                    slideData?.map((value: any, key: number) => (
                        <SwiperSlide key={key}>
                            <div className={styles.swiperItem}>
                                <Desktop>
                                    <Magnifier
                                        className={styles.magnifyImg}
                                        src={value?.imageUrl}
                                        height={"100%"}
                                    />
                                </Desktop>

                                <Mobile>
                                    <CachedImage src={value?.imageUrl} alt={value?.imageUrl} />
                                </Mobile>
                                {/* <CachedImage src={value?.imageUrl} alt={value?.imageUrl} /> */}
                            </div>
                        </SwiperSlide>
                    ))}
                {/* {imageOptionColor === "" &&
                    mappingsData
                        ?.filter((e) => e.imageUrl !== "")
                        ?.map((value: any, key: number) => (
                            <SwiperSlide key={key}>
                                <div className={styles.swiperItem}>
                                    <Magnifier
                                        className={styles.magnifyImg}
                                        src={value?.imageUrl}
                                        height={"100%"}
                                    />
                                </div>
                            </SwiperSlide>
                        ))} */}
                {imageOptionColor !== "" && (
                    <SwiperSlide>
                        <div className={styles.swiperItem}>
                            <Desktop>
                                <Magnifier
                                    className={styles.magnifyImg}
                                    src={
                                        imageOptionColor !== null
                                            ? imageOptionColor
                                            : slideData[0]?.imageUrl
                                    }
                                    height={"100%"}
                                />
                            </Desktop>
                            <Mobile>
                                <CachedImage
                                    src={
                                        imageOptionColor !== null
                                            ? imageOptionColor
                                            : slideData[0]?.imageUrl
                                    }
                                    alt="img"
                                />
                            </Mobile>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.swiperSmall}
            >
                {slideData?.map((value: any, key: number) => (
                    <SwiperSlide onClick={onSlide} key={key}>
                        <div className={styles.swiperItem}>
                            <CachedImage src={value?.imageUrl} alt={value?.imageUrl} />
                        </div>
                    </SwiperSlide>
                ))}
                {/* {mappingsData
                    ?.filter((e) => e.imageUrl !== "")
                    ?.map((value: any, key: number) => (
                        <SwiperSlide onClick={onSlide} key={key}>
                            <div className={styles.swiperItem}>
                                <CachedImage src={value?.imageUrl} alt={value?.imageUrl} />
                            </div>
                        </SwiperSlide>
                    ))} */}
            </Swiper>
        </div>
    );
};

export default ProductGallery;
