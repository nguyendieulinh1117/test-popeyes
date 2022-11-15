import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import Select from "react-select";
import Link from "next/link";
import IconLeft from "@assets/icons/pagination-left.svg";
import IconRight from "@assets/icons/pagination-right.svg";

import CachedImage from "@@@CachedImage";
import ProductItem from "@@@ProductItem";
import { Mobile, Desktop } from "@@@Media";

import styles from "./ProductShow.module.scss";
import { useDispatch } from "react-redux";
import { homeActions, productActions } from "@redux/actions";
import { useRouter } from "next/router";
import { getLimitItems, getProductDetailUrl, isEmptyObject } from "@utils";
import Loading from "@components/Common/Loading";
import { paths } from "@constants";
import Pagination from "@components/Common/Pagination";
import { EnumkeyCollections } from "@constants/enum";
import categories from "@redux/sagas/categories";
import * as Scroll from "react-scroll";

const emptySuggestData = [
    {
        name: "Áo",
        src: "/images/demo/category.jpg",
    },
    {
        name: "Quần",
        src: "/images/demo/category.jpg",
    },
    {
        name: "Chân Váy",
        src: "/images/demo/category.jpg",
    },
    {
        name: "Đầm",
        src: "/images/demo/category.jpg",
    },
    {
        name: "Áo Khoác & Áo Vest",
        src: "/images/demo/category.jpg",
    },
];

const options = [
    { value: "default", label: "Mặc định" },
    { value: "created_time:asc", label: "Hàng mới nhất" },
    { value: "created_time:desc", label: "Hàng cũ nhất" },
    { value: "price:desc", label: "Giá giảm dần" },
    { value: "price:asc", label: "Giá tăng dần" },
];

type PropType = {
    categoriesData: any;
    loading: boolean;
    setLoading: (boo: boolean) => void;
    productCount: number;
    setProductCount: (count: number) => void;
    slug: String;
};

const ProductShow = (props: PropType) => {
    const { loading, setLoading, productCount, setProductCount } = props;
    const dispatch = useDispatch();
    const route = useRouter();
    const { query, push } = route;
    const { categories }: any = query;
    const slugTemp = categories[categories.length - 1];
    const [selectedSort, setSelectedSort] = useState<any>(options[0].value);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [productList, setProductList] = useState([]);
    const [productSuggestion, setProductSuggestion] = useState<any[]>([]);
    const [productData, setProductData] = useState<any>({});
    const [currentParams, setCurrentParams] = useState({
        page: 1,
        page_size: 12,
        category_slug: slugTemp,
    });
    const [filterParams, setFilterParams] = useState({});

    useEffect(() => {
        if (query.page) {
            setCurrentParams({
                ...currentParams,
                page: Number(query.page),
            });
        } else {
            setCurrentParams({
                ...currentParams,
                page: 1,
            });
        }
    }, [query]);

    useEffect(() => {
        if (productList?.length > 0) {
            setIsEmpty(false);
            setProductCount(productData?.total);
        } else {
            setIsEmpty(true);
            setProductCount(0);
            getCollectionSuggestion();
        }
    }, [productList]);

    const getCollectionSuggestion = () => {
        dispatch(
            homeActions.getCollectionByTag({
                tag: EnumkeyCollections.SUGGESTION,
                onCompleted: (res: any) => {
                    const items: any[] = res?.data?.items;
                    setProductSuggestion(getLimitItems(items, 5));
                },
                onError: (err: any) => {},
            })
        );
    };

    const getProducts = (params: any) => {
        setLoading(true);
        dispatch(
            productActions.getProducts({
                params,
                onCompleted: (res: any) => {
                    setLoading(false);
                    setProductData(res?.data);
                    setProductList(res?.data?.items);
                },
                onError: (err: any) => {
                    setLoading(false);
                },
            })
        );
    };

    const changePage = (page: number) => {
        setCurrentParams({
            ...currentParams,
            page,
        });
        if (page > 1) {
            route.query.page = String(page);
            route.push(route);
        } else {
            delete route.query.page;
            route.push(`${route.asPath.split("?")[0]}`);
        }

        const scroll = Scroll.animateScroll;
        scroll.scrollToTop({ smooth: true });
    };

    useEffect(() => {
        getProducts({
            ...currentParams,
            ...filterParams,
        });
    }, [currentParams, filterParams]);

    useEffect(() => {
        let { sort, sort_type } = query;
        let { categories, slug, ...filterQuery }: any = query;

        if (!slug) {
            slug = categories[categories.length - 1];
        }

        if (sort && sort_type) {
            setSelectedSort(`${sort}:${sort_type}`);
        } else {
            setSelectedSort(options[0].value);
        }

        if (!isEmptyObject(filterQuery)) {
            setCurrentParams({
                ...currentParams,
                category_slug: slug,
            });
            setFilterParams(filterQuery);
        } else {
            let { page, page_size } = currentParams;

            setCurrentParams({
                page,
                page_size,
                category_slug: slug,
            });
            setFilterParams({});
        }
    }, [route.asPath]);

    const setSort = (selectedSort: any) => {
        let { sort, sort_type, ...baseQuery } = query;
        let pushQuery: any = {};

        if (selectedSort !== "default") {
            let sort_query = selectedSort.split(":")[0];
            let sort_type_query = selectedSort.split(":")[1];

            pushQuery = {
                sort: sort_query,
                sort_type: sort_type_query,
            };
        }

        push({
            query: {
                ...baseQuery,
                ...pushQuery,
            },
        });
    };

    return (
        <div className={styles.productShow}>
            <Loading active={loading} />
            <Desktop>
                <div className={styles.head}>
                    <div className={styles.count}>
                        <span>{productCount} sản phẩm</span>
                    </div>
                    <div className={styles.sort}>
                        <span>Sắp xếp theo</span>
                        <Select
                            defaultValue={selectedSort}
                            value={options.find((options) => options.value === selectedSort)}
                            onChange={(e) => setSort(e.value)}
                            options={options}
                            className={styles.selectSort}
                            classNamePrefix={"prefix"}
                            name={"sort"}
                            isSearchable={false}
                        />
                    </div>
                </div>
            </Desktop>
            <div className={styles.body}>
                {isEmpty ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyNotice}>
                            <p>Danh sách sản phẩm đang được cập nhật ...</p>
                        </div>
                        {productSuggestion?.length > 0 && (
                            <div className={styles.emptySuggest}>
                                <div className={styles.title}>Gợi ý cho bạn</div>
                                <ul>
                                    {productSuggestion?.map((value: any, key: number) => (
                                        <Link key={key} href={getProductDetailUrl(value)} passHref>
                                            <li>
                                                <figure>
                                                    <CachedImage
                                                        src={value?.images[0]?.imageUrl}
                                                        alt={value?.name}
                                                    />
                                                    <figcaption> {value?.name} </figcaption>
                                                </figure>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.show}>
                        {productList?.map((value: any, key: number) => (
                            <ProductItem data={value} key={key} className={styles.productCol} />
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.footer}>
                {productData.totalPage > 1 && (
                    <Pagination
                        totalPage={productData.totalPage}
                        currentpage={productData.page}
                        pageParams={currentParams.page}
                        onChange={changePage}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductShow;
