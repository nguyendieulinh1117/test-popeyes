import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import classNames from "classnames";

import Header from "@@Header";
import Footer from "@@Footer";
import ToolBar from "@@ToolBar";
import Copyright from "@@Footer/Copyright";
import { Mobile, Desktop } from "@@@Media";
import { categoriesActions } from "@redux/actions";
import { paths } from "@constants";
import useDevices from "@hooks/useDevices";
import BackToTop from "./BackToTop";
import NotifyToast from "@@@NotifyToast";

import styles from "./index.module.scss";
import Head from "next/head";
import Icon from "@assets/icons/logo.png";
import MetaWrapper from "@components/Common/MetaWrapper";
import CustomerChat from "./CustomerChat";

const MainLayout = ({ children }: any) => {
    const { pathname } = useRouter();
    const dispatch = useDispatch();

    const ToolBarMobile = [
        `${paths.productDetail}/[slug]`,
        paths.cart,
        paths.checkout,
        paths.orderSuccess,
        paths.orderFail,
        paths.orderCancel,
    ].includes(pathname);

    const hideFooterMobile = [
        `${paths.productDetail}/[slug]`,
        paths.cart,
        paths.checkout,
        paths.orderSuccess,
        paths.orderFail,
        paths.orderCancel,
    ].includes(pathname);

    const conditionHeader = [`${paths.productDetail}/[slug]`, paths.home].includes(pathname);

    const getAllCategories = () => {
        dispatch(categoriesActions.getListCategories());
    };

    useEffect(() => {
        getAllCategories();
    }, []);
    const [isScroll, setIsScroll] = useState<boolean>(false);
    const { isMobile } = useDevices();
    const [isMenuMobile, setIsMenuMobile] = useState<boolean>(false);

    let lastScroll = 0;
    let scrollup = false;
    const trackScrolling = () => {
        const currentScroll = window.pageYOffset;
        if (isMobile) {
            if (currentScroll <= 108) {
                setIsScroll(false);

                scrollup = false;
                return;
            }
        } else {
            if (currentScroll <= 130) {
                scrollup = false;

                setIsScroll(false);

                return;
            }
        }

        if (currentScroll > lastScroll) {
            if (isMobile) {
                setIsScroll(true);
            } else {
                if (scrollup === true) {
                    setIsScroll(true);
                }
            }
        } else if (currentScroll < lastScroll) {
            setIsScroll(true);
            scrollup = true;
        }
        lastScroll = currentScroll;
    };

    useEffect(() => {
        document.addEventListener("scroll", trackScrolling);

        return () => {
            document.removeEventListener("scroll", trackScrolling);
        };
    }, [scrollup]);

    const meta = {
        title: "VM STYLE - Thời Trang Trẻ",
        description:
            "VM STYLE - Thương hiệu thời trang dành cho giới trẻ. Kiểu dáng đa dạng phù hợp với mọi phong cách.",
        image: Icon.src,
    };

    return (
        <MetaWrapper meta={meta} condition={conditionHeader}>
            <div className={styles.mainLayout}>
                <header className={classNames(styles.header, { [styles.scroll]: isScroll })}>
                    <Header isMenuMobile={isMenuMobile} setIsMenuMobile={setIsMenuMobile} />
                </header>

                <main className={styles.body}>{children}</main>

                <footer className={styles.footer}>
                    <Mobile>
                        {!hideFooterMobile && (
                            <>
                                <Footer />
                                <Copyright />
                            </>
                        )}
                        {!ToolBarMobile && <ToolBar setIsMenuMobile={setIsMenuMobile} />}
                    </Mobile>
                    <Desktop>
                        <Footer />
                        <Copyright />
                    </Desktop>
                    <div className={styles.plugins}>
                        <BackToTop />
                        <NotifyToast />
                        <CustomerChat />
                    </div>
                </footer>
            </div>
        </MetaWrapper>
    );
};

export default MainLayout;
