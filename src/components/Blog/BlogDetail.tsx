import React, { useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";

import { useSelectorTyped } from "@hooks/useSelectorType";

import CachedImage from "@@@CachedImage";
import Button from "@@@Form/Button";
import NewsItem from "@@@NewsItem";
import Breadcrumbs from "@@@Breadcrumbs";
import IconTime from "@assets/icons/time.svg";

import styles from "./index.module.scss";
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

const BlogDetail = () => {
    const { blogs, blogDetail } = useSelectorTyped((state) => state.home);
    const [load, setLoad] = useState<number>(3);
    const router = useRouter();

    return (
        <div className={styles.blog}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />

            <div className="container">
                <div className={styles.box}>
                    <div className={styles.wrap}>
                        <div className={styles.big}>
                            <h3 className={styles.titleTop}>{blogDetail.title}</h3>
                            <div className={styles.time}>
                                <IconTime />{" "}
                                <p>{moment(blogDetail?.updatedTime).format("DD/MM/YYYY")}</p>
                            </div>

                            <figure>
                                <CachedImage src={blogDetail.imageUrl} alt="" />
                            </figure>

                            <article
                                className={styles.content}
                                dangerouslySetInnerHTML={{ __html: String(blogDetail.blogContent) }}
                            ></article>
                        </div>
                        <div className={styles.small}>
                            <h3 className={styles.titleRight}>Có thể bạn quan tâm</h3>
                            {blogs
                                ?.filter((e: any) => e.approve && e.id !== blogDetail.id)
                                ?.sort((a: any, b: any) => b.order - a.order)
                                ?.splice(0, 4)
                                ?.map((value: any, key: number) => (
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
                                ?.filter((e: any) => e.approve && e.id !== blogDetail.id)
                                ?.sort((a: any, b: any) => b.order - a.order)
                                ?.splice(4, load)
                                ?.map((value: any, key: number) => (
                                    <NewsItem className={styles.listCol} data={value} key={key} />
                                ))}
                        </div>
                        {blogs
                            ?.filter((e: any) => e.approve && e.id !== blogDetail.id)
                            ?.sort((a: any, b: any) => b.order - a.order)
                            ?.splice(4, load)?.length <
                            blogs
                                ?.filter((e: any) => e.approve && e.id !== blogDetail.id)
                                ?.sort((a: any, b: any) => b.order - a.order)
                                ?.splice(4, blogs.length)?.length && (
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

export default BlogDetail;
