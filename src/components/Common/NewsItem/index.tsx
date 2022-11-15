import React from "react";
import classNames from "classnames";
import Link from "next/link";
import moment from "moment";

import CachedImage from "@@@CachedImage";

import IconTime from "@assets/icons/time.svg";

import styles from "./index.module.scss";
import { paths } from "@constants";

const NewsItem = ({ data, className }: any) => {
    return (
        <div className={classNames(styles.newsCol, className)}>
            <div className={styles.newsItem}>
                <div className={styles.img}>
                    <Link href={`${paths.blog}/${data?.slug}`} passHref>
                        <figure>
                            <CachedImage src={data?.mobileImageUrl} alt={data?.title} />
                        </figure>
                    </Link>
                </div>
                <div className={styles.text}>
                    <p>
                        <IconTime /> {moment(data?.updatedTime).format("DD/MM/YYYY")}
                    </p>
                    <Link href={`${paths.blog}/${data?.slug}`} passHref>
                        <h3>{data?.title}</h3>
                    </Link>
                    <article>{data?.summary}</article>
                </div>
            </div>
        </div>
    );
};

export default NewsItem;
