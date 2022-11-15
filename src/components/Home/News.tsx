import React, { useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { homeActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import Button from "@@@Form/Button";
import NewsItem from "@@@NewsItem";
import { paths } from "@constants";

import styles from "./News.module.scss";

const News = () => {
    const { blogs } = useSelectorTyped((state) => state.home);
    const data: Array<any> =  blogs
        ?.filter((e: any) => e.approve)
        ?.sort((a: any, b: any) => b.order - a.order)
        ?.splice(0, 4);
    return (
        data.length > 0?
        <div className={styles.news}>
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>Tin tức - sự kiện</h3>
                    </div>
                    <div className={styles.list}>
                        <div className={styles.listBox}>
                            { 
                            data?.map((value: any, key: number) => (
                                    <NewsItem data={value} key={key} />
                                ))}
                        </div>
                        <Link href={paths.blog} passHref>
                            <div className={styles.btn}>
                                <Button>Xem thêm</Button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        : <></>
    );
};

export default News;
