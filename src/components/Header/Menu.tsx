import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import classNames from "classnames";

import { paths } from "@constants";

import IconArrow from "@assets/icons/arrow.svg";
import IconArrowLeft from "@assets/icons/arrow-left.svg";
import IconArrowRight from "@assets/icons/arrow-right.svg";
import styles from "./Menu.module.scss";
import { useDispatch } from "react-redux";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { getCategorieslUrl, isEmptyObject, sortItemJson } from "@utils";
import { Desktop, Mobile } from "@components/Common/Media";
import { useRouter } from "next/router";

type MenuPropTypes = {
    className?: string;
    onHideMenu?: any;
};

const Menu = ({ className, onHideMenu }: MenuPropTypes) => {
    const route = useRouter();
    const { asPath, query } = route;
    const { slug } = query;
    const categoriesSelector = useSelectorTyped((state: any) => state.categories.allCategories);
    const categories = categoriesSelector?.items;
    const [cate, setCate] = useState<any>({});
    const [cateBackSlug, setCateBackSLug] = useState<string>("");
    const [currentSlug, setCurrentSlug] = useState<string>("");

    const getCate = (beforeSlug: string, categories: any, slug: any) => {
        if (categories.slug === slug) {
            if (categories.children?.length > 0) {
                setCateBackSLug(beforeSlug);
                setCate(categories);
            } else {
                setCurrentSlug(beforeSlug);
            }
        } else {
            categories.children?.forEach((value: any) => getCate(categories.slug, value, slug));
        }
    };

    const renderCurrentSLug = () => {
        let pathRoute = asPath?.split("/")[1];
        if (pathRoute === "danh-muc" && slug) {
            setCurrentSlug(`${slug}`);
        } else {
            setCurrentSlug("");
        }
    };

    useEffect(() => {
        renderCurrentSLug();
    }, [categories, asPath]);

    useEffect(() => {
        if (currentSlug !== "") {
            categories?.forEach((value: any) => getCate("", value, currentSlug));
        } else {
            setCate({});
            setCateBackSLug("");
        }
    }, [currentSlug, categories]);

    const renderMenuCategoriesMobile = useMemo(() => {
        return isEmptyObject(cate) ? (
            <ul className={classNames(styles.menu, className)}>
                {categories
                    ?.sort((a, b) => b.priority - a.priority)
                    ?.map((item: any, key: number) => (
                        <li key={`categories_${key}`}>
                            <div className={styles.menuBox}>
                                <Link href={getCategorieslUrl(item)} key={key} passHref>
                                    <span onClick={() => onHideMenu()}>{item?.name}</span>
                                </Link>
                                {item?.children?.length > 0 && (
                                    <>
                                        <IconArrow onClick={() => setCurrentSlug(`${item.slug}`)} />
                                        <div className={styles.menuListWrap}>
                                            <ul className={styles.menuList}>
                                                {item?.children
                                                    ?.sort((a, b) => b.priority - a.priority)
                                                    ?.map((children: any, key_children: number) => (
                                                        <Link
                                                            href={getCategorieslUrl(children)}
                                                            key={key_children}
                                                        >
                                                            <li>
                                                                <a>{children?.name}</a>
                                                            </li>
                                                        </Link>
                                                    ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        ) : (
            <div className={styles.childrenMenu}>
                <div className={styles.parentName}>
                    <IconArrowLeft onClick={() => setCurrentSlug(`${cateBackSlug}`)} />
                    {/* <Link href={(!cateBackSlug || cateBackSlug ==='')? paths.home : `${paths.categories}/${cateBackSlug}`}> */}
                    <span>{cate.name}</span>
                    {/* </Link> */}
                </div>
                <ul className={styles.listChildren}>
                    {cate.children.length > 0 &&
                        cate.children
                            ?.sort((a, b) => b.priority - a.priority)
                            .map((item: any, key: number) => (
                                <li key={`menu-desktop-key${key}`}>
                                    <Link href={getCategorieslUrl(item)} passHref>
                                        <span
                                            className={classNames({
                                                [styles.active]: slug === item.slug,
                                            })}
                                            onClick={() => onHideMenu()}
                                        >
                                            {item?.name}
                                        </span>
                                    </Link>
                                    {item?.children?.length > 0 && (
                                        <IconArrowRight
                                            onClick={() => setCurrentSlug(`${item.slug}`)}
                                        />
                                    )}
                                </li>
                            ))}
                </ul>
            </div>
        );
    }, [cate, categories, slug]);
    
    return (
        <>
            <Desktop>
                <ul className={classNames(styles.menu, className)}>
                    {categories?.map((item: any, key: number) => (
                        <Link
                            href={getCategorieslUrl(item)}
                            key={`link_${key}`}
                            passHref
                        >
                            <li>
                                <div className={styles.menuBox}>
                                    <span>{item?.name}</span>
                                    {item?.children?.length > 0 && (
                                        <>
                                            <IconArrow />
                                            <div className={styles.menuListWrap}>
                                                <ul className={styles.menuList}>
                                                    {item?.children
                                                        ?.sort((a, b) => b.priority - a.priority)
                                                        ?.map(
                                                            (
                                                                children: any,
                                                                key_children: number
                                                            ) => (
                                                                <Link
                                                                    href={getCategorieslUrl(children)}
                                                                    key={`children_${key_children}`}
                                                                    passHref
                                                                >
                                                                    <li
                                                                        className={classNames({
                                                                            [styles.children]:
                                                                                children?.children
                                                                                    ?.length > 0,
                                                                        })}
                                                                    >
                                                                        <a> {children?.name} </a>
                                                                        {children?.children
                                                                            ?.length > 0 && (
                                                                            <ul
                                                                                className={
                                                                                    styles.subMenuList
                                                                                }
                                                                            >
                                                                                {children?.children
                                                                                    ?.sort(
                                                                                        (a, b) =>
                                                                                            b.priority -
                                                                                            a.priority
                                                                                    )
                                                                                    ?.map(
                                                                                        (
                                                                                            item: any,
                                                                                            index: number
                                                                                        ) => (
                                                                                            <Link
                                                                                                href={getCategorieslUrl(item)}
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                passHref
                                                                                            >
                                                                                                <li>
                                                                                                    {" "}
                                                                                                    <a>
                                                                                                        {" "}
                                                                                                        {
                                                                                                            item?.name
                                                                                                        }{" "}
                                                                                                    </a>{" "}
                                                                                                </li>
                                                                                            </Link>
                                                                                        )
                                                                                    )}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                </Link>
                                                            )
                                                        )}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </Desktop>
            <Mobile>{renderMenuCategoriesMobile}</Mobile>
        </>
    );
};

export default Menu;
