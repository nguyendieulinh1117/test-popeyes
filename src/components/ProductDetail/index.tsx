import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Breadcrumbs from "@@@Breadcrumbs";
import { Desktop } from "@@@Media";

import styles from "./index.module.scss";
import { useRouter } from "next/router";
import {  productActionTypes } from "@redux/actions";
import { isEmptyObject, sortItemJson } from "@utils";
import Loading from "@components/Common/Loading";
import { useSelectorTyped } from "@hooks/useSelectorType";
import Notfound404 from "@hocs/Notfound404";
import MetaWrapper from "@components/Common/MetaWrapper";
import { ssrMode } from "@constants";
import { selectItemFunc } from "@utils/measureEcommerceGA";

const ProductGallery = dynamic(() => import("./ProductGallery"), { ssr: false });
const ProductInfo = dynamic(() => import("./ProductInfo"), { ssr: false });
const ProductPolicy = dynamic(() => import("./ProductPolicy"), { ssr: false });
const ProductContent = dynamic(() => import("./ProductContent"), { ssr: false });
const ProductRelated = dynamic(() => import("./ProductRelated"), { ssr: false });

const ProductDetail = () => {
    const route = useRouter();
    const { arrStores, arrProvinces }: any = useSelectorTyped((state) => state.store);
    const {productDetail}: any = useSelectorTyped((state) => state.product);
    
    const { [productActionTypes.GET_PRODUCT_DETAIL_BY_SLUG_LOADING]: loading }: any 
        = useSelectorTyped((state) => state.loading);
    const [breadcrumbsData, setBreadcrumbsData] = useState<any>([]);
    const [imageOptionColor, setImageOptionColor] = useState("");

    const findBreadcrumbsData = breadcrumbsData.filter((filter: any) => filter.label !== undefined);

    const getStoreStocks = () => {
        const codes = new Set(
            productDetail?.stocks?.map(({ storeCode }: { storeCode: string }) => storeCode)
        );
        const storeStocks = arrStores?.items?.filter(({ code }: { code: string }) =>
            codes.has(code)
        );

        return arrProvinces
            ?.map((province: any) => {
                return {
                    ...province,
                    districts: province?.districts
                        ?.map((district) => {
                            return {
                                ...district,
                                stores: storeStocks?.filter(
                                    (store: any) => district.id === store.districtId
                                ),
                            };
                        })
                        .filter((item: any) => item?.stores?.length > 0),
                };
            })
            .filter((item: any) => item?.districts?.length > 0);
    };

    const storeStocks = getStoreStocks();

    useEffect(() => {
        if (!isEmptyObject(productDetail)) {
            selectItemFunc(productDetail)
            let categoriesTemp = productDetail?.categories[0];

            let parentTemp = categoriesTemp?.parent?.parent
                ? [
                      {
                          label: categoriesTemp?.parent?.parent?.name,
                          url: `/${categoriesTemp?.parent?.parent?.slug}`,
                          active: false,
                      },
                  ]
                : [];

            let parent = categoriesTemp?.parent
                ? [
                      {
                          label: categoriesTemp?.parent?.name,
                          url: "/" + categoriesTemp?.parent?.slug,
                          active: false,
                      },
                  ]
                : [];

            setBreadcrumbsData([
                ...[
                    {
                        label: "Trang chủ",
                        url: "/",
                        active: false,
                    },
                ],
                ...parentTemp,
                ...parent,
                ...[
                    {
                        label: productDetail.categories[0]?.name,
                        url: `${parentTemp[0] ? parentTemp[0].url : ""}${
                            parent[0] ? parent[0].url : ""
                        }/${productDetail.categories[0]?.slug}`,
                        active: false,
                    },
                    {
                        label: productDetail.name,
                        active: true,
                    },
                ],
            ]);
        }
    }, [productDetail]);

    return (
        <MetaWrapper
            meta={{
                description: productDetail?.description,
                title: productDetail?.name,
                image: productDetail?.images?.length ? productDetail?.images[0]?.imageUrl : '',
                url: !ssrMode ? window.location.href : ""
            }}>
                <div className={styles.productDetail}>
                    <Loading active={loading} />
                    <Breadcrumbs breadcrumbs={findBreadcrumbsData} />
                    <div className="container">
                        <div className={styles.main}>
                            <div className={styles.gallery}>
                                <ProductGallery
                                    setImageOptionColor={setImageOptionColor}
                                    imageOptionColor={imageOptionColor}
                                    slideData={sortItemJson(productDetail?.images, "id")}
                                    mappingsData={sortItemJson(productDetail?.mappings, "id")}
                                />
                            </div>
                            <div className={styles.info}>
                                <ProductInfo
                                    setImageOptionColor={setImageOptionColor}
                                    data={productDetail}
                                    storeStocks={storeStocks}
                                    imageOptionColor={imageOptionColor}
                                />
                            </div>
                            <Desktop>
                                <div className={styles.policy}>
                                    <ProductPolicy />
                                </div>
                            </Desktop>
                        </div>
                        {productDetail?.description && (
                            <div className={styles.detail}>
                                <ProductContent contentData={productDetail?.description} />
                            </div>
                        )}
                        {productDetail?.relatedProducts?.length > 0 && (
                            <div className={styles.related}>
                                <ProductRelated data={productDetail} />
                            </div>
                        )}
                    </div>
                </div>
        </MetaWrapper>
    );
};

export default ProductDetail;
