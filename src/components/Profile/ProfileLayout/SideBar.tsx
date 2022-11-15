import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import style from "./SideBar.module.scss";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

//component
import CachedImage from "@components/Common/CachedImage";
import IconUser from "@assets/icons/user.svg";
import IconCheckList from "@assets/icons/check-list.svg";
import IconLocation from "@assets/icons/location.svg";
import IconAvatar from "@assets/icons/avatar.svg";
import Button from "@components/Common/Form/Button";
import { paths } from "@constants";
import { Desktop, Mobile } from "@components/Common/Media";
import useAuth from "@hooks/useAuth";
import { authActions } from "@redux/actions";

const SideBar = () => {
    const dispatch = useDispatch();
    const route = useRouter();
    const { pathname } = route;
    const { user } = useAuth();

    const list = [
        {
            path: paths.profile.index,
            title: "Tài khoản của tôi",
            icon: <IconUser />,
            activePath: [paths.profile.index, paths.profile.changePassword],
        },
        {
            path: paths.profile.order.index,
            title: "Đơn hàng của tôi",
            icon: <IconCheckList className={style.iconCheck} />,
            activePath: [
                paths.profile.order.index,
                `${paths.profile.order.index}/[status]`,
                `${paths.profile.detailOrder}/[code]`,
            ],
        },
        {
            path: paths.profile.address,
            title: "Sổ địa chỉ",
            icon: <IconLocation />,
            activePath: [
                paths.profile.address,
                paths.profile.createAddress,
                paths.profile.updateAddress,
            ],
        },
    ];

    const listMobile = [
        {
            path: paths.profile.information,
            title: "Tài khoản của tôi",
            icon: <IconUser />,
            activePath: [paths.profile.index, paths.profile.changePassword],
        },
        {
            path: paths.profile.order.index,
            title: "Đơn hàng của tôi",
            icon: <IconCheckList className={style.iconCheck} />,
            activePath: [
                paths.profile.order.index,
                `${paths.profile.order.index}/[status]`,
                `${paths.profile.detailOrder}/[code]`,
            ],
        },
        {
            path: paths.profile.address,
            title: "Sổ địa chỉ",
            icon: <IconLocation />,
            activePath: [
                paths.profile.address,
                paths.profile.createAddress,
                paths.profile.updateAddress,
            ],
        },
    ];

    const onLogout = () => {
        toast.success("Đăng xuất thành công");
        dispatch(
            authActions.logout({
                onCompleted: () => {
                    route.push(paths.home);
                },
            })
        );
    };

    return (
        <div className={style.sideBar}>
            <div className={style.body}>
                <div className={style.avatar}>
                    <div className={style.image}>
                        <IconAvatar />
                    </div>
                    <span>{user?.fullName}</span>
                </div>
                <div className={style.navList}>
                    <Desktop>
                        {list.map((item, index) => (
                            <Link key={index} href={item.path} passHref>
                                <div
                                    className={classNames(style.item, {
                                        [style.active]: item.activePath?.includes(pathname),
                                    })}
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        ))}
                    </Desktop>
                    <Mobile>
                        {listMobile.map((item, index) => (
                            <Link key={index} href={item.path} passHref>
                                <div className={style.item}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                            </Link>
                        ))}
                    </Mobile>
                </div>
            </div>
            <Button buttonStyle="secondary" className={style.btnLogout} onClick={() => onLogout()}>
                Đăng xuất
            </Button>
        </div>
    );
};

export default SideBar;
