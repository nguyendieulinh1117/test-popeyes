import React, { FC, useEffect, useMemo, useState } from "react";
import classNames from "classnames";

import Breadcrumbs from "@@@Breadcrumbs";
import Filter from "./Filter";
import ProductShow from "./ProductShow";
import FilterMobile from "./FilterMobile";
import { Desktop, Mobile } from "@@@Media";

import IconClose from "@assets/icons/clode-light.svg";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { categoriesActions } from "@redux/actions";
import { isEmptyObject } from "@utils";
import { paths } from "@constants";

type ProductType = {
    slug: String;
};

const Product = ({ slug }: ProductType) => {
    const dispatch = useDispatch();
    const [isFilterMobile, setIsFilterMobile] = useState<boolean | undefined>(false);
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(0);

    const onShowFilterAside = () => {
        setIsFilterMobile(false);
        document.body.style.overflow = "auto";
        document.body.style.touchAction = "auto";
    };

    const getCategoriesBySlug = (slug: any) => {
        dispatch(
            categoriesActions.getCategoriesSlug({
                params: { slug: slug },
                onCompleted: (res: any) => setData(res?.data),
                onError: (err: any) => {},
            })
        );
    };

    useEffect(() => {
        getCategoriesBySlug(slug);
    }, [slug]);

    const breadcrumbsData = useMemo(() => {
        if (!isEmptyObject(data)) {
            if (data.parent) {
                let parentTemp = data.parent.parent
                    ? [
                          {
                              label: data.parent.parent.name,
                              url: `/${data.parent.parent.slug}`,
                              active: false,
                          },
                      ]
                    : [];

                return [
                    ...[
                        {
                            label: "Trang chủ",
                            url: "/",
                            active: false,
                        },
                    ],
                    ...parentTemp,
                    ...[
                        {
                            label: data.parent.name,
                            url: `${parentTemp[0] ? parentTemp[0].url : ""}/${data.parent.slug}`,
                            active: false,
                        },
                        {
                            label: data?.name,
                            active: true,
                        },
                    ],
                ];
            } else {
                return [
                    {
                        label: "Trang chủ",
                        url: "/",
                        active: false,
                    },
                    {
                        label: data?.name,
                        active: true,
                    },
                ];
            }
        } else {
            return [];
        }
    }, [data]);

    return (
        <div className={styles.product}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div
                        className={classNames(styles.filter, {
                            [styles.filterAside]: isFilterMobile,
                        })}
                    >
                        <div className={styles.filterMain}>
                            <div className={styles.filterShow}>
                                <Mobile>
                                    <button type="button" onClick={() => onShowFilterAside()}>
                                        <IconClose />
                                    </button>
                                </Mobile>
                                <Filter
                                    onShowFilterAside={onShowFilterAside}
                                    productCount={productCount}
                                    categoriesData={data}
                                />
                            </div>
                        </div>
                    </div>
                    <Mobile>
                        <div className={styles.filterMobile}>
                            <FilterMobile setIsFilterMobile={setIsFilterMobile} />
                        </div>
                    </Mobile>
                    <div className={styles.show}>
                        <ProductShow
                            slug={slug}
                            productCount={productCount}
                            setProductCount={setProductCount}
                            loading={loading}
                            setLoading={setLoading}
                            categoriesData={data}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
