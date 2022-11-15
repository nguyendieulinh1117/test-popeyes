import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { homeActions } from "@redux/actions";
import Link from "next/link";

import { useSelectorTyped } from "@hooks/useSelectorType";
import useDevices from "@hooks/useDevices";
import CachedImage from "@@@CachedImage";
import Breadcrumbs from "@@@Breadcrumbs";
import ProductItem from "@@@ProductItem";
import Button from "@@@Form/Button";

import styles from "./index.module.scss";
import { Banner } from "@common/Models/ApiModels";
import { useRouter } from "next/router";
import { paths } from "@constants";
import { EnumkeyCollections } from "@constants/enum";
import moment from "moment";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Sale đồng giá",
        active: true,
    },
];

const BannerTypes: any = {
    Slide: "Slide",
    SmallSlide: "SmallSlide",
};

const ProductSale = () => {
    const dispatch = useDispatch();
    const { banners } = useSelectorTyped((state) => state.home);
    const { collections } = useSelectorTyped((state) => state.home);

    const CollectionsHotDeals = collections.find((e) => e.tag === EnumkeyCollections.HOST_DEALS);

    const [productChildren, setProductChildren] = useState<any>();
    const [countProduct, setCountProduct] = useState<boolean>();
    const { isMobile } = useDevices();
    const [isTab, setIsTab] = useState<number>(0);
    const [today, setToday] = useState(moment().format("DD-MM-YYYY hh:mm:ss a"));
    const onActiveTab = (key: any) => {
        setIsTab(key);
    };

    const callApiColectionBySlug = (slug: string) => {
        dispatch(
            homeActions.getCollectionByTag({
                tag: slug,
                onCompleted: (res: any) => {
                    setProductChildren(res.data);
                },
                onError: (err: any) => {},
            })
        );
    };

    const onChangeTab = (key: number, slug: string) => {
        onActiveTab(key);
        callApiColectionBySlug(slug);
    };

    const hostDeals = CollectionsHotDeals?.children?.filter(
        (e: any) =>
            e.isActive &&
            moment(
                moment(e?.from).format("DD-MM-YYYY hh:mm:ss a"),
                "DD-MM-YYYY hh:mm:ss a"
            ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
            moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                moment(moment(e?.to).format("DD-MM-YYYY hh:mm:ss a"), "DD-MM-YYYY hh:mm:ss a")
            )
    );

    useEffect(() => {
        dispatch(homeActions.getListBanner());

        if (hostDeals && hostDeals?.length > 0 && hostDeals[0]?.slug) {
            callApiColectionBySlug(hostDeals[0]?.slug);
        }
    }, []);

    useEffect(() => {
        if (productChildren?.products.length <= 10) {
            setCountProduct(false);
        } else {
            setCountProduct(true);
        }
    }, [productChildren]);

    return (
        <div className={styles.productSale}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.slide}>
                    <Swiper
                        className={styles.mySwiper}
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
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
                                            <CachedImage src={value.imageUrl} alt={value.title} />
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>SALE ĐỒNG GIÁ</h3>
                        <ul>
                            {hostDeals?.map((value: any, key: number) => (
                                <li
                                    key={key}
                                    className={classNames({ [styles.active]: isTab === key })}
                                >
                                    <Button onClick={() => onChangeTab(key, value.slug)}>
                                        {value?.name}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.show}>
                        {productChildren?.products?.map((value: any, key: number) => {
                            if (isMobile && key >= 6) {
                                return;
                            }
                            return (
                                <>
                                    {value?.isActive && (
                                        <ProductItem
                                            key={key}
                                            data={value}
                                            className={styles.productCol}
                                        />
                                    )}
                                </>
                            );
                        })}
                    </div>
                    <div className={styles.btn}>
                        <>
                            {countProduct && (
                                <Link
                                    href={`${paths.collection}/${productChildren?.slug}`}
                                    passHref
                                >
                                    <Button>Xem thêm</Button>
                                </Link>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSale;
