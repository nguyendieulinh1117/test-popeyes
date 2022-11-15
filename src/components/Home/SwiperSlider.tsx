import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { useSelectorTyped } from "@hooks/useSelectorType";
import { homeActions } from "@redux/actions";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import CachedImage from "@@@CachedImage";

import styles from "./SwiperSlider.module.scss";
import { Banner } from "@common/Models/ApiModels";
import useDevices from "@hooks/useDevices";

const BannerTypes: any = {
    Slide: "Slide",
    SmallSlide: "SmallSlide",
};

const SwiperSlider = () => {
    const { banners } = useSelectorTyped((state) => state.home);
    const { isMobile } = useDevices();

    return (
        <div className={styles.swiperSlider}>
            <div className="container">
                <Swiper
                    className={styles.mySwiper}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{ clickable: true }}
                    //   onSlideChange={() => console.log('slide change')}
                    //   onSwiper={(swiper) => console.log(swiper)}
                >
                    {banners
                        ?.filter((e: Banner) => e.approve && e.bannerType === BannerTypes.Slide)
                        ?.sort((a: Banner, b: Banner) => b.order - a.order)
                        ?.map((value: Banner, key: number) => (
                            <SwiperSlide key={key}>
                                <Link href={value?.linkUrl} passHref>
                                    <div className={styles.swiperItem}>
                                        <CachedImage
                                            src={isMobile ? value.mobileImageUrl : value.imageUrl}
                                            alt={value.title}
                                        />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                </Swiper>
                <div className={styles.bannerSmall}>
                    <div className={styles.box}>
                        {banners
                            ?.filter(
                                (e: Banner) => e.approve && e.bannerType === BannerTypes.SmallSlide
                            )
                            ?.sort((a: Banner, b: Banner) => b.order - a.order)
                            ?.map((value: Banner, key: number) => (
                                <Link key={key} href={value?.linkUrl} passHref>
                                    <div className={styles.bannerSmallCol}>
                                        <figure>
                                            <CachedImage
                                                src={
                                                    isMobile ? value.mobileImageUrl : value.imageUrl
                                                }
                                                alt={value?.title}
                                            />
                                        </figure>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwiperSlider;
