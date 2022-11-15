import React from "react";
import styles from "./index.module.scss";
import { useRouter } from 'next/router';

//component
import SideBar from "./SideBar";
import Breadcrumbs from "@@@Breadcrumbs";
import { Desktop, Mobile } from "@components/Common/Media";
import { paths } from '@constants';

import { ProfileProvider } from "../ProfileContext";

const ProfileLayout = (Props: any) => {
    const { children, breadcrumbsData } = Props;
    const route = useRouter();
    const { pathname } = route;

    return (
        <ProfileProvider>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className={styles.profile}>
                <Desktop>
                    <div className="container">
                        <div className={styles.layout}>
                            <SideBar />
                            {children}
                        </div>
                    </div>
                </Desktop>
                <Mobile>
                    <div className={styles.layout}>
                        {
                            pathname === paths.profile.index ? 
                            <SideBar />
                            :
                            children
                        }
                    </div>
                </Mobile>
            </div>
        </ProfileProvider>
    );
};

export default ProfileLayout;
