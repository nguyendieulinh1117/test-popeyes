import React, { useEffect, useState } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";

import BasicForm from "@@@Form/BasicForm";
import Button from "@@@Form/Button";
import CheckBoxField from "@@@Form/CheckBoxField";
import { Mobile, Desktop } from "@@@Media";

import IconArrow from "@assets/icons/arrow.svg";
import IconClose from "@assets/icons/close.svg";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { getCategorieslUrl, removeDuplicateArrayOfObject } from "@utils";
import Link from "next/link";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths } from "@constants";

const FilterCollapse = dynamic(() => import("./FilterCollapse"), { ssr: false });
const priceData = [
    {
        displayName: "Nhỏ hơn 100.000đ",
        filterValue: "<100000",
    },
    {
        displayName: "Từ 100.000đ - 200.000đ",
        filterValue: ">99000 AND <200000",
    },
    {
        displayName: "Từ 200.000đ - 350.000đ",
        filterValue: ">199000 AND <350000",
    },
    {
        displayName: "Từ 350.000đ - 500.000đ",
        filterValue: ">349000 AND <500000",
    },
    {
        displayName: "Từ 500.000đ - 700.000đ",
        filterValue: ">499000 AND <700000",
    },
    {
        displayName: "Lớn hơn 700.000đ",
        filterValue: ">699000",
    },
];

type PropType = {
    categoriesData: any;
    productCount: number;
    onShowFilterAside: () => void;
};

const Filter = React.memo((props: PropType) => {
    const { categoriesData, productCount, onShowFilterAside } = props;
    const { query, push } = useRouter();

    const { categories }: any = query;
    const slug = categories[categories?.length - 1];

    const productFilter = useSelectorTyped((state) => state.categories.productFilter);
    const [resultData, setResultData] = useState<any>([]);

    const onSelected = (item: any, name: string) => {
        onShowFilterAside();

        const checkData = resultData.find(
            (find: any) => find.filterValue === item.filterValue && find.key === name
        );
        if (checkData) {
            removeToParams([
                {
                    item,
                    name,
                },
            ]);
        } else {
            pushToParams([
                {
                    item,
                    name,
                },
            ]);
        }
    };

    const onSelectePriceRange = (item: any) => {
        onShowFilterAside();
        const checkData = resultData.find((find: any) => find.filterValue === item.filterValue);

        // let min = parseFloat(item.filterValue.split(',')[0]);
        // let max = parseFloat(item.filterValue.split(',')[1]);
        if (checkData) {
            removeToParams([
                {
                    item,
                    name: "priceRage",
                },
            ]);
        } else {
            pushToParams([
                {
                    item,
                    name: "priceRage",
                },
            ]);
        }
    };

    const mapParamsToResultData = (query: any, productFilter: any) => {
        let { slug, ...baseQuery } = query;
        let resultData: any = [];
        Object.keys(baseQuery).forEach((e) => {
            if (e === "query") {
                let arrayQuery = query["query"]
                    ?.toString()
                    .replace("salePrice:", "")
                    .replace("((", "(")
                    .replace("))", ")")
                    .split(" OR ");
                arrayQuery?.forEach((value: any) => {
                    let item = priceData.find((find: any) => `(${find.filterValue})` === value);

                    resultData.push({
                        ...item,
                        key: "priceRage",
                    });
                });
            } else {
                let arrayQuery = baseQuery[e]?.toString().split(",");
                let filterGroup: any = productFilter.find((find: any) => find.key === e);
                if (filterGroup) {
                    arrayQuery?.forEach((value: any) => {
                        let item = filterGroup.items.find(
                            (find: any) => find.filterValue === value
                        );

                        resultData.push({
                            ...item,
                            key: filterGroup.key,
                        });
                    });
                }
            }
        });

        return resultData;
    };

    const pushToParams = (array: any) => {
        let { slug, ...baseQuery } = query;
        let pushQuery: any = {};

        array.forEach((element: any) => {
            if (element.name === "priceRage") {
                if (query["query"]) {
                    let queryData = query["query"]
                        ?.toString()
                        .replace("salePrice:", "")
                        .replace("((", "(")
                        .replace("))", ")")
                        .split(" OR ")
                        .filter((value) => value !== `(${element.item.filterValue})`)
                        .join(" OR ");
                    pushQuery = {
                        ...pushQuery,
                        query: `salePrice:(${queryData} OR (${element.item.filterValue}))`,
                    };
                } else {
                    pushQuery = {
                        ...pushQuery,
                        query: `salePrice:(${element.item.filterValue})`,
                    };
                }
            } else {
                if (query[element.name]) {
                    let queryData = query[element.name]
                        ?.toString()
                        .split(",")
                        .filter((value) => value !== element.item.filterValue)
                        .toString();
                    pushQuery = {
                        ...pushQuery,
                        [element.name]: queryData + `,${element.item.filterValue}`,
                    };
                } else {
                    pushQuery = {
                        ...pushQuery,
                        [element.name]: element.item.filterValue,
                    };
                }
            }
        });
        push({
            query: {
                ...baseQuery,
                ...pushQuery,
            },
        });
    };

    const removeToParams = (array: any) => {
        let { slug, ...baseQuery } = query;
        let pushQuery: any = baseQuery;

        array.forEach((element: any) => {
            if (element.name === "priceRage") {
                let queryData = query["query"]
                    ?.toString()
                    .replace("salePrice:", "")
                    .replace("((", "(")
                    .replace("))", ")")
                    .split(" OR ")
                    .filter((value) => value !== `(${element.item.filterValue})`)
                    .join(" OR ");

                if (queryData) {
                    pushQuery = {
                        ...pushQuery,
                        query:
                            queryData.search(" OR ") === -1
                                ? `salePrice:${queryData}`
                                : `salePrice:(${queryData})`,
                    };
                } else {
                    delete pushQuery["query"];
                }
            } else {
                let queryData = query[element.name]
                    ?.toString()
                    .split(",")
                    .filter((value) => value !== element.item.filterValue)
                    .toString();
                if (queryData) {
                    pushQuery = {
                        ...pushQuery,
                        [element.name]: queryData,
                    };
                } else {
                    delete pushQuery[element.name];
                }
            }
        });

        push({
            query: pushQuery,
        });
    };

    const removeAllFilter = () => {
        onShowFilterAside();
        const { categories }: any = query;
        const routePath = categories.map((e) => e).join("/");
        push({
            pathname: routePath,
            query: {},
        });
    };

    useEffect(() => {
        let resultParams = mapParamsToResultData(query, productFilter);

        setResultData(resultParams);
    }, [query, productFilter]);

    return (
        <div className={styles.filter}>
            <Mobile>
                <div className={styles.mobileTitle}>
                    <h3>BỘ LỌC</h3>
                </div>
            </Mobile>
            <div className={styles.box}>
                <BasicForm
                    initialValues={{
                        price: "",
                    }}
                >
                    <Desktop>
                        <div className={styles.title}>
                            <h3>{categoriesData?.name}</h3>
                            <ul>
                                {categoriesData?.children?.map((value: any, key: number) => (
                                    <Link key={key} href={getCategorieslUrl(value)} passHref>
                                        <li
                                            className={classNames({
                                                [styles.active]:
                                                    value.slug.replace("/", "") === slug,
                                            })}
                                        >
                                            <button>
                                                <h3>{value.name}</h3>
                                                <IconArrow />
                                            </button>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </Desktop>
                    {resultData?.length > 0 && (
                        <div className={styles.result}>
                            <div className={styles.head}>
                                <label> Lọc theo </label>
                                {resultData?.length > 0 && (
                                    <button type="button" onClick={() => removeAllFilter()}>
                                        <span>Xoá tất cả</span>
                                    </button>
                                )}
                            </div>
                            {resultData?.length > 0 && (
                                <ul className={styles.body}>
                                    {resultData?.map((value: any, key: number) => (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                onClick={() => onSelected(value, value.key)}
                                            >
                                                <IconClose />
                                            </button>
                                            <span>{value.displayName}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    {productFilter.map((item: any, index: number) => {
                        if (item.key === "category_codes") return;
                        if (item.items?.length < 1) return;

                        return (
                            <FilterCollapse
                                key={index}
                                label={item.title}
                                className={styles.type}
                                data={removeDuplicateArrayOfObject(item.items, "filterValue")}
                                name={item.key}
                                onSelected={onSelected}
                                resultData={resultData}
                            />
                        );
                    })}
                    <FilterCollapse
                        label="Khoảng giá (VND)"
                        className={styles.price}
                        isSpecial={true}
                        onSelected={onSelected}
                        name="price"
                        resultData={resultData}
                    >
                        {priceData?.map((value: any, key: number) => (
                            <CheckBoxField
                                key={key}
                                className={styles.priceItem}
                                name={value?.displayName}
                                onClick={() => onSelectePriceRange(value)}
                                checked={
                                    !!resultData?.find(
                                        (e: any) => e.filterValue === value.filterValue
                                    )
                                }
                            >
                                {value?.displayName}
                            </CheckBoxField>
                        ))}
                    </FilterCollapse>
                    <Mobile>
                        <div className={styles.mobileBtn}>
                            <p>
                                <span>{productCount}</span> sản phẩm
                            </p>
                            <Button onClick={removeAllFilter}>Đặt lại</Button>
                            <Button onClick={onShowFilterAside} buttonStyle="secondary">
                                Đã xong
                            </Button>
                        </div>
                    </Mobile>
                </BasicForm>
            </div>
        </div>
    );
});
Filter.displayName = "Filter";
export default Filter;
