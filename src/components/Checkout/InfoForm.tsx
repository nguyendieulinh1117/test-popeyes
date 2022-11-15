import React from "react";

import IconUser from "@assets/icons/user.svg";
import styles from "./InfoForm.module.scss";
import classNames from "classnames";
import AuthencationModal from "@components/Authencation";

type InfoFormType = {
    children: any;
    isAuth?: boolean;
    name?: string;
};

const InfoForm = ({ children, isAuth = false, name }: InfoFormType) => {
    const [isShow, setIsShow] = React.useState<boolean>(false);
    return (
        <>
            <div className={styles.infoWrap}>

                <div className={styles.titleForm}>
                    <p>THÔNG TIN NHẬN HÀNG</p>
                    <div className={styles.user}>
                        <IconUser />
                        {isAuth ? (
                            <span>{name}</span>
                        ) : (
                            <span onClick={() => setIsShow(true)}>Đăng nhập</span>
                        )}
                    </div>
                </div>
                {children}
            </div>
            <AuthencationModal isShow={isShow} setIsShow={setIsShow} />
        </>
        
    );
};

export default InfoForm;
