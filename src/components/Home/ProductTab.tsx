import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";

import ProductItem from "@@@ProductItem";
import Button from "@@@Form/Button";
import useDevices from "@hooks/useDevices";

import styles from "./ProductTab.module.scss";
import { paths } from "@constants";
import { fillterCustom, getLimitItems } from "@utils";
import { useDispatch } from "react-redux";
import { homeActions, homeActionTypes } from "@redux/actions";
import Loading from "@components/Common/Loading";
import { useSelectorTyped } from "@hooks/useSelectorType";
import Empty from "@@@Empty";
import moment from "moment";

const ProductTab = ({ productData }: any) => {
    const dispatch = useDispatch();
    const { isMobile } = useDevices();
    const { collectionNew } = useSelectorTyped((state) => state.home);
    const [today, setToday] = useState(moment().format("DD-MM-YYYY hh:mm:ss a"));

    const productDataTab = fillterCustom(productData?.children, "isActive") || [];
    const availableProductDataTab = productDataTab.filter(
        (e) =>
            moment(
                moment(e?.from).format("DD-MM-YYYY hh:mm:ss a"),
                "DD-MM-YYYY hh:mm:ss a"
            ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
            moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                moment(moment(e?.to).format("DD-MM-YYYY hh:mm:ss a"), "DD-MM-YYYY hh:mm:ss a")
            )
    );
    const [isTab, setIsTab] = useState<string>(availableProductDataTab[0]?.slug);
    const [collectionHouseWear, setCollectionHouseWear] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const callApiCollectionById = (slug: string) => {
        setIsLoading(true);
        dispatch(
            homeActions.getCollectionByTag({
                tag: slug,
                onCompleted: (res: any) => {
                    setIsLoading(false);
                    setCollectionHouseWear(res?.data || []);
                },
                onError: () => {
                    setIsLoading(false);
                },
            })
        );
    };

    const onChangeTab = (slug: string) => {
        setIsTab(slug);
        callApiCollectionById(slug);
    };

    useEffect(() => {
        if (availableProductDataTab && availableProductDataTab[0]?.slug) {
            callApiCollectionById(availableProductDataTab[0]?.slug);
        }
    }, [collectionNew]);

    return (
        <>
            <div className={styles.productTab}>
                <div className="container">
                    <div className={styles.box}>
                        <div className={styles.title}>
                            <h3>{productData?.name}</h3>
                        </div>
                        <div className={styles.tab}>
                            <ul>
                                {availableProductDataTab.map((value: any, key: number) => (
                                    <li
                                        key={key}
                                        className={classNames({
                                            [styles.active]: isTab === value?.slug,
                                        })}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onChangeTab(value?.slug)}
                                        >
                                            {value?.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {!isLoading ? (
                            <>
                                {collectionHouseWear?.products?.length > 0 ? (
                                    <div className={styles.list}>
                                        <div className={styles.listBox}>
                                            {fillterCustom(
                                                getLimitItems(collectionHouseWear?.products, 10) ||
                                                    [],
                                                "isActive"
                                            )?.map((value: any, key: number) => {
                                                if (isMobile && key >= 6) {
                                                    return;
                                                }
                                                return (
                                                    <ProductItem
                                                        data={value}
                                                        key={key}
                                                        className={styles.productCol}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {collectionHouseWear?.products?.length >= 10 && (
                                            <div className={styles.btn}>
                                                <Link
                                                    href={`${paths.collection}/${collectionHouseWear?.slug}`}
                                                >
                                                    <a className={styles.viewMore}>Xem thêm</a>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Empty />
                                )}
                            </>
                        ) : (
                            // <Loading active={isLoading} />
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default React.memo(ProductTab);
