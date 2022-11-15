import React, { useState, useEffect, createRef } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useDispatch } from "react-redux";

import { commonKeys, paths } from '@constants';
import Menu from '@@Header/Menu';
import AuthencationModal from "@components/Authencation";
import useAuth from "@hooks/useAuth";
import { storeActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";

import IconClose from '@assets/icons/clode-light.svg';
import IconPhone from '@assets/icons/phone.svg';
import IconStore from '@assets/icons/store.svg';
import IconHeadphone from '@assets/icons/headphone.svg';
import styles from './index.module.scss';
import useDynamicContent from '@hooks/useDynamicContent';
import { replaceAll } from '@utils';

type MenuMobilePropTypes = {
    isMenuMobile?: boolean,
    setIsMenuMobile?: any,
}

const MenuMobile = ({ isMenuMobile, setIsMenuMobile }: MenuMobilePropTypes) => {
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState<boolean>(false);
    const {isAuthenticated, user} = useAuth();
    const { totalStores } = useSelectorTyped((state) => state.store);
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);

    const onHideMenu = () => {
        setIsMenuMobile(false);
        document.body.style.overflow = 'auto';
        document.body.style.touchAction = 'auto';
    }

    useEffect(() => {
        dispatch(storeActions.getTotalStores({}));
    }, []);

    return (
        <div className={classNames(styles.menuMobile, { [styles.active]: isMenuMobile })}>

            <div className={styles.menuFixed}  >
                <div className={styles.box}>
                    <button type="button" className={styles.close} onClick={() => onHideMenu()}>
                        <IconClose />
                    </button>
                    <div className={styles.head}>
                        <h3>{isAuthenticated ? `Chào ${user?.fullName}` : 'Chào bạn!'}</h3>
                    </div>
                    <div className={styles.body}>
                        <ul className={styles.info}>
                            <Link href={paths.store} passHref>
                                <li onClick={() => onHideMenu()}>
                                    <IconStore />
                                    <span><span>Xem Hệ Thống</span>  {totalStores || 0} cửa hàng</span>
                                </li>
                            </Link>
                            <li>
                                <IconHeadphone />
                                <Link href={`tel:${replaceAll(contenValue?.phoneTakeCare, '.', '')}`} passHref>
                                    <span>CSKH: {contenValue?.phoneTakeCare}</span>
                                </Link>
                            </li>
                            <li>
                                <IconPhone />
                                <Link href={`tel:${replaceAll(contenValue?.hotLine, '.', '')}`} passHref>
                                    <span>{contenValue?.hotLine}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.foot}>
                        <Menu className={styles.menuList} onHideMenu={onHideMenu} />
                        
                    </div>
                    {!isAuthenticated && 
                            <div className={styles.menuLogin}>
                                <button type="button" onClick={() => {setIsShow(true), onHideMenu()}}>
                                    <p>Đăng nhập / Đăng ký</p>
                                </button>
                                <AuthencationModal
                                    isShow={isShow}
                                    setIsShow={setIsShow}
                                />
                            </div>
                        }
                </div>
                <button 
                type="button" 
                className={styles.closeOutSide} 
                onClick={() => onHideMenu()} />
            </div>
        </div>
    );
}

export default MenuMobile;