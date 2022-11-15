import React from "react";
import classNames from "classnames";
import Link from "next/link";

import CachedImage from "@@@CachedImage";
import ProductItem from "@@@ProductItem";
import { paths } from "@constants";
import { Desktop } from "@@@Media";
import { getLimitItems } from "@utils";

import styles from "./ProductStyle.module.scss";

const ProductStyle = ({ productData, className, classNameBox }: any) => {
    const products = productData?.products?.filter((e: any) => e.isActive);
    return (
        <div className={classNames(styles.productStyle, className)}>
            <div className="container">
                <div className={classNames(styles.box, classNameBox)}>
                    <Desktop>
                        <div className={styles.banner}>
                            <Link href={`${paths.collection}/${productData?.slug}`}>
                                <a>
                                    <figure>
                                        <CachedImage
                                            src={
                                                productData?.images?.find((e: any) => e.isDefault)
                                                    ?.imageUrl
                                            }
                                            alt={productData?.tag}
                                        />
                                    </figure>
                                </a>
                            </Link>
                        </div>
                    </Desktop>
                    <div className={styles.list}>
                        <div className={styles.title}>
                            <h3>{productData?.name}</h3>
                        </div>
                        <div className={styles.listBox}>
                            {getLimitItems(products)?.map((value: any, key: number) => (
                                <ProductItem data={value} key={key} className={styles.productCol} />
                            ))}
                        </div>
                        <div className={styles.btn}>
                            <Link href={`${paths.collection}/${productData?.slug}`}>
                                <a className={styles.viewMore}>Xem thêm</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductStyle);
