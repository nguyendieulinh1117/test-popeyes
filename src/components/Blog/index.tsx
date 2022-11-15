import React, { useState } from "react";
import moment from "moment";
import { useRouter } from "next/router";

import { useSelectorTyped } from "@hooks/useSelectorType";

import CachedImage from "@@@CachedImage";
import Button from "@@@Form/Button";
import NewsItem from "@@@NewsItem";
import IconTime from "@assets/icons/time.svg";
import Breadcrumbs from "@@@Breadcrumbs";

import styles from "./index.module.scss";
import classNames from "classnames";
import { paths } from "@constants";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Tin tức",

        active: true,
    },
];

const Blog = () => {
    const router = useRouter();

    const { blogs } = useSelectorTyped((state) => state.home);
    const [load, setLoad] = useState<number>(3);
    const response = blogs
        ?.filter((e: any) => e.approve)
        ?.sort((a: any, b: any) => b.order - a.order);

    return (
        <div className={styles.blog}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>BÀI VIẾT Mới nhất</h3>
                    </div>
                    <div className={styles.wrap}>
                        <div
                            className={classNames(styles.big, styles.list)}
                            onClick={() => router.push(`${paths.blog}/${response[0]?.slug}`)}
                        >
                            <figure>
                                <CachedImage src={response[0]?.imageUrl} alt="" />
                            </figure>
                            <h3>{response[0]?.title}</h3>
                            <article>{response[0]?.summary}</article>
                        </div>
                        <div className={styles.small}>
                            {response?.splice(1, 4)?.map((value: any, key: number) => (
                                <div
                                    key={key}
                                    className={styles.smallItem}
                                    onClick={() => router.push(`${paths.blog}/${value?.slug}`)}
                                >
                                    <figure>
                                        <CachedImage
                                            src={value?.mobileImageUrl}
                                            alt={value?.title}
                                        />
                                    </figure>
                                    <div>
                                        <h3>{value?.title}</h3>
                                        <p>
                                            <IconTime />{" "}
                                            {moment(value?.updatedTime).format("DD/MM/YYYY")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.title}>
                        <h3>Các Bài viết Khác</h3>
                    </div>
                    <div className={styles.list}>
                        <div className={styles.listBox}>
                            {blogs
                                ?.filter((e: any) => e.approve)
                                ?.sort((a: any, b: any) => b.order - a.order)
                                ?.splice(5, load)
                                ?.map((value: any, key: number) => (
                                    <NewsItem className={styles.listCol} data={value} key={key} />
                                ))}
                        </div>
                        {blogs
                            ?.filter((e: any) => e.approve)
                            ?.sort((a: any, b: any) => b.order - a.order)
                            ?.splice(5, load)?.length <
                            blogs
                                ?.filter((e: any) => e.approve)
                                ?.sort((a: any, b: any) => b.order - a.order)
                                ?.splice(5, response.length)?.length && (
                            <div className={styles.btn}>
                                <Button onClick={() => setLoad(load + 6)}>Xem thêm</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
