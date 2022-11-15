import React, { useEffect, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { Router, useRouter } from "next/router";
import { toast } from "react-toastify";

import Search from "./Search";
import Menu from "./Menu";
import AuthencationModal from "../Authencation";
import { commonKeys, paths, storageKeys } from "@constants";
import { Mobile, Desktop } from "@@@Media";
import MenuMobile from "@@MenuMobile";
import CartHover from "@@Header/CartHover";
import useDevices from "@hooks/useDevices";
import useAuth from "@hooks/useAuth";
import { authActions, storeActions, basketActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { getStringData } from "@utils/localStorage";

import IconUser from "@assets/icons/user.svg";
import IconLogo from "@assets/icons/logo.svg";
import IconLogoScroll from "@assets/icons/logo-no-text.svg";
import IconCart from "@assets/icons/cart.svg";
import IconPhone from "@assets/icons/phone.svg";
import IconStore from "@assets/icons/store.svg";
import IconHeadphone from "@assets/icons/headphone.svg";
import IconMenu from "@assets/icons/menu-bar.svg";
import IconLogout from "@assets/icons/logout.svg";

import styles from "./index.module.scss";
import useDynamicContent from "@hooks/useDynamicContent";
import { replaceAll } from "@utils";
import ClientSideRender from "@hocs/ClientSideRender";

const Header = (props: any) => {
    const {isMenuMobile, setIsMenuMobile} = props;
    const dispatch = useDispatch();
    const { isMobile } = useDevices();
    const { totalStores } = useSelectorTyped((state) => state.store);
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    const { isAuthenticated, user } = useAuth();
    const { reload, pathname } = useRouter();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isScroll, setIsScroll] = useState<boolean>(false);

    const { basketData } = useSelectorTyped((state) => state.basket);

    const getBaskets = async () => {
        const basketId = await getStringData(storageKeys.BASKET_ID);
        if (basketId) {
            dispatch(basketActions.getBasket(basketId));
            dispatch(basketActions.checkStockBasket(basketId));
        }
    };

    useEffect(() => {
        getBaskets();
        if (isAuthenticated) {
            dispatch(authActions.getProfile());
        }
    }, [isAuthenticated]);

    const onShowMenu = () => {
        setIsMenuMobile(true);
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
    };

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

    const onLogout = () => {
        toast.success("Đăng xuất thành công");
        dispatch(
            authActions.logout({
                onCompleted: () => {
                    reload();
                },
            })
        );
    };

    useEffect(() => {
        document.addEventListener("scroll", trackScrolling);

        return () => {
            document.removeEventListener("scroll", trackScrolling);
        };
    }, [scrollup]);

    return (
        <div
            className={classNames(
                styles.header,
                // { [styles.scrollDown]: isScrollDown && !isMobile},
                // { [styles.scrollUp]: isScrollUp && !isMobile},
                { [styles.scroll]: isScroll }
            )}
        >
            <div className={styles.container}>
                <div className={styles.box}>
                    <Mobile>
                        <div className={styles.menuBar}>
                            <button type="button" onClick={() => onShowMenu()}>
                                <IconMenu />
                            </button>
                            <MenuMobile
                                isMenuMobile={isMenuMobile}
                                setIsMenuMobile={setIsMenuMobile}
                            />
                        </div>
                    </Mobile>
                    <div className={styles.logo}>
                        <Link href={paths.home} passHref>
                           <span> <IconLogo /> </span> 
                        </Link>
                    </div>
                    <div className={styles.logoScroll}>
                        <Link href={paths.home} passHref>
                           <span> <IconLogoScroll /> </span>
                        </Link>
                    </div>
                    <Desktop>
                        <ul className={styles.info}>
                            <Link href={paths.store} passHref>
                                <li>
                                    <IconStore />
                                    <span>
                                        <span>Xem Hệ Thống</span> {totalStores || 0} cửa hàng
                                    </span>
                                </li>
                            </Link>
                            <li>
                                <IconHeadphone />
                                <Link href={`tel:${replaceAll(contenValue?.phoneTakeCare, '.', '')}`} passHref>
                                    <span>CSKH: {contenValue?.phoneTakeCare}</span>
                                </Link>
                            </li>
                            {/* <li>
                                <IconPhone />
                                <Link href={`tel:${replaceAll(contenValue?.hotLine, '.', '')}`} passHref>
                                    <span>{contenValue?.hotLine}</span>
                                </Link>
                            </li> */}
                        </ul>
                    </Desktop>
                    <div className={styles.search}>
                        <Search />
                    </div>
                    <ul className={styles.tools}>
                        <Desktop>
                            <li>
                                <ClientSideRender>
                                    <button type="button" onClick={() => setIsShow(true)}>
                                        <IconUser />
                                        <span>{isAuthenticated ? user.fullName : "Đăng nhập"}</span>
                                    </button>
                                </ClientSideRender>
                                {isAuthenticated ? (
                                    <div className={styles.loginHover}>
                                        <ul>
                                            <li> <Link href={paths.profile.index} passHref> Tài khoản của tôi </Link> </li>
                                            <li> <Link href={paths.profile.order.index} passHref> Đơn hàng của tôi </Link> </li>
                                            <li> <Link href={paths.profile.address} passHref> Sổ địa chỉ </Link> </li>
                                            <li
                                                className={styles.logout}
                                                onClick={() => onLogout()}
                                            >
                                                <IconLogout />
                                                <span>Đăng xuất</span>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <AuthencationModal isShow={isShow} setIsShow={setIsShow} />
                                )}
                            </li>
                        </Desktop>
                        <li>
                            <figure>
                                <IconCart />
                                {basketData && (basketData?.products?.length > 0 || basketData?.combos?.length > 0) && (
                                    <figcaption>
                                        {basketData?.products?.reduce(
                                            (prev: any, current: any) => prev + current?.quantity,
                                            0
                                        ) + basketData?.combos?.reduce(
                                            (prev: any, current: any) => prev + current?.quantity,
                                            0
                                        )}
                                    </figcaption>
                                )}
                            </figure>
                            <Desktop>
                                <p>Giỏ hàng</p>
                            </Desktop>
                            <Mobile>
                                <Link href={paths.cart} passHref>
                                    <span className="poa" title="cart" />
                                </Link>
                            </Mobile>
                            <Desktop>
                                <CartHover
                                    data={basketData}
                                    setShow={setIsShow}
                                    className={styles.cartHover}
                                />
                            </Desktop>
                        </li>
                    </ul>
                </div>
                <Desktop>
                    <div className={styles.menu}>
                        <Menu />
                    </div>
                </Desktop>
            </div>
        </div>
    );
};

export default Header;
