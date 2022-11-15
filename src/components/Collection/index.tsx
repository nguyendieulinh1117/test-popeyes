import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import Breadcrumbs from "@@@Breadcrumbs";
import { homeActions } from "@redux/actions";
import ProductItem from "@@@ProductItem";

import styles from "./index.module.scss";
import Notfound404 from "@hocs/Notfound404";
import Loading from "@components/Common/Loading";
import moment from "moment";

const Collection = () => {
    const dispatch = useDispatch();
    const [collections, setCollections] = useState<any>({});
    const [isFound, setIsFound] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { query } = useRouter();
    const [today, setToday] = useState(moment().format("DD-MM-YYYY hh:mm:ss a"));

    setInterval(() => {
        setToday(moment().format("DD-MM-YYYY hh:mm:ss a"));
    }, 10000);
    const breadcrumbsData = [
        {
            label: "Trang chủ",
            url: "/",
            active: false,
        },
        {
            label: collections?.name,
            active: true,
        },
    ];

    useEffect(() => {
        if (!query?.slug) {
            setIsFound(false);
            return;
        }
        setIsLoading(true);
        dispatch(
            homeActions.getCollectionByTag({
                tag: query?.slug,
                onCompleted: (res: any) => {
                    setIsFound(res.success);
                    setCollections(res.data);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsFound(false);
                    setIsLoading(false);
                },
            })
        );
    }, []);
    return (
        <Notfound404 condition={isFound}>
            <div className={styles.collection}>
                <Breadcrumbs breadcrumbs={breadcrumbsData} />
                <div className="container">
                    <div className={styles.box}>
                        <div className={styles.title}>
                            <h3>{collections?.name}</h3>
                        </div>
                        {moment(
                            moment(collections?.from).format("DD-MM-YYYY hh:mm:ss a"),
                            "DD-MM-YYYY hh:mm:ss a"
                        ).isSameOrBefore(moment(today, "DD-MM-YYYY hh:mm:ss a")) &&
                        moment(today, "DD-MM-YYYY hh:mm:ss a").isSameOrBefore(
                            moment(
                                moment(collections?.to).format("DD-MM-YYYY hh:mm:ss a"),
                                "DD-MM-YYYY hh:mm:ss a"
                            )
                        ) ? (
                            <div className={styles.show}>
                                {collections?.products?.map((value: any, key: number) => {
                                    return (
                                        <ProductItem
                                            key={key}
                                            data={value}
                                            className={styles.productCol}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div>Hiện tại bộ sưu tập đang không mở bán!</div>
                        )}
                    </div>
                </div>
                <Loading active={isLoading} />
            </div>
        </Notfound404>
    );
};
export default Collection;
