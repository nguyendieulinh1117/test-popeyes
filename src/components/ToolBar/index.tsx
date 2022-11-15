import React from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import classNames from "classnames";

import { paths } from "@constants";
import AuthencationModal from "@components/Authencation";
import useAuth from "@hooks/useAuth";

import IconHome from "@assets/icons/home.svg";
import IconCategory from "@assets/icons/category.svg";
import IconStore from "@assets/icons/store.svg";
import IconUser from "@assets/icons/user.svg";
import styles from "./index.module.scss";

const ToolBar = (props: any) => {
    const {setIsMenuMobile} = props;
    const { pathname } = useRouter();
    const { isAuthenticated } = useAuth();
    const [isShow, setIsShow] = React.useState<boolean>(false);
    const toolBarData = [
        {
            name: 'Trang chủ',
            icon: <IconHome />,
            link: '/',
        },
        {
            name: 'Danh mục',
            icon: <IconCategory />,
            link: paths.categories,
        },
        {
            name: 'Cửa hàng',
            icon: <IconStore />,
            link: paths.store,
        },
        // {
        //     name: 'Cá nhân',
        //     icon: <IconUser />,
        //     // link: paths.profile,
        //     link: '',
        // },
    ]

    return (
        <div className={styles.toolBar}>
            <div className={styles.toolFixed}>
                <div className="container">
                    <div className={styles.box}>
                        <ul>
                            {toolBarData.map((value: any, key: number) => {
                                return key === 1 ?
                                <li key={key} onClick={() =>setIsMenuMobile(true)} className={classNames({ [styles.active]: pathname === value.link })} >
                                    {value.icon}
                                    <p>{value.name}</p>
                                </li> :
                                <Link key={key} href={value.link} passHref>
                                    <li className={classNames({ [styles.active]: pathname === value.link })} >
                                        {value.icon}
                                        <p>{value.name}</p>
                                    </li>
                                </Link>
                            })}
                            <li 
                                onClick={() => setIsShow(true)} 
                                className={classNames({ [styles.active]: pathname === paths.profile.index })} 
                            >
                                <IconUser />
                                <p>Cá nhân</p>
                                {isAuthenticated && <Link href={paths.profile.index} passHref><a className="poa"></a></Link>}
                            </li>
                            {!isAuthenticated && <AuthencationModal
                                isShow={isShow}
                                setIsShow={setIsShow}
                            />}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToolBar;