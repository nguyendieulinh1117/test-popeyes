
import React  from 'react';

import BaseModal from '@@@Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import styles from './index.module.scss';

type AuthencationModalPropTypes = {
    isShow?: boolean,
    setIsShow: Function,
    isLogin?: boolean;
}

const LoginModal = ({ isShow, setIsShow, isLogin }: AuthencationModalPropTypes) => {
    
    const onCloseModal = () => {
        setIsShow(false);
    };

    return (
        <BaseModal
            isOpen={isShow}
            onClose={() => onCloseModal()}
            bodyClass={styles.modalBody}
            headerClass={styles.modalHeader}
        >
            <div className={styles.tabCustom}>

                <button
                    type="button"
                    className={styles.active}
                >
                    {isLogin ? 'Đăng Nhập' : 'Đăng ký' }
                </button>
                <br/>
                <p>Vui lòng <b>{isLogin ? 'Đăng Nhập' : 'Đăng Ký' }</b> để nhận được nhiều ưu đãi trong tương lai.</p> 
            </div>
            <div className={styles.form}>
                {isLogin ? (
                    <LoginForm onCloseModal={onCloseModal} />
                ) : (
                    <RegisterForm />
                )}
            </div>
        </BaseModal >
    )
}

export default LoginModal;