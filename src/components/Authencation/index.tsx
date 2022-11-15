
import React, { useRef, useState } from 'react';
import classNames from 'classnames';

import BaseModal from '@@@Modal';
import BasicForm from '@@@Form/BasicForm';
import InputTextField from "@@@Form/InputTextField";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { authActions } from '@redux/actions';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { authenticationMessages } from '@constants/defineMessage';
import { emailRegExp } from '@constants';

type AuthencationModalPropTypes = {
    isShow?: boolean,
    setIsShow: Function,
}

const AuthencationModal = ({ isShow, setIsShow }: AuthencationModalPropTypes) => {

    const dispatch = useDispatch();


    const formRef: any = useRef();

    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isPassword, setIsPassword] = useState<boolean>(false);
    const [isNewPassword, setIsNewPassword] = useState<boolean>(false);
    const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
    const [errorForget, setErrorForget] = useState<string>();
    
    const onCloseModal = () => {
        setIsShow(false);
        setIsLogin(true);
        setIsPassword(false);
        setIsNewPassword(false);
    };

    const onGetPassword = () => {
        setIsPassword(true);
        setIsShow(false);
    };

    const onConfirmPassword = () => {
        const params = formRef.current.values;
        setErrorForget('')
        setDisabledBtn(true);
        if (isPassword && !isNewPassword) {
            dispatch(authActions.forgetPassword({
                params,
                onCompleted: (res) => {
                    setIsNewPassword(true);
                    setDisabledBtn(false);
                },
                onError: () => {
                    setErrorForget('Tài khoản không tồn tại');
                    setDisabledBtn(false);
                }
            }))
        } else {
            delete params.rePassword
            dispatch(authActions.resetPassword({
                params,
                onCompleted: (res) => {
                    setDisabledBtn(false);
                    onCloseModal()
                    toast.success("Đặt lại mật khẩu thành công, vui lòng sử dụng mật khẩu mới để đăng nhập")
                },
                onError: (error) => {
                    setDisabledBtn(false);
                    setErrorForget('OTP hoặc thông tin không đúng');
                }
            }))
        }
    };

    const onCancelPassword = () => {
        if (isPassword && !isNewPassword) {
            setIsPassword(false);
            setIsShow(true);
            setIsNewPassword(false);
        } else {
            setIsPassword(true);
            setIsNewPassword(false);
        }
    };

    return (
        !isPassword ? (
            <BaseModal
                isOpen={isShow}
                onClose={() => onCloseModal()}
                bodyClass={styles.modalBody}
                headerClass={styles.modalHeader}
            >
                <div className={styles.tab}>
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={classNames({ [styles.active]: isLogin })}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={classNames({ [styles.active]: !isLogin })}
                    >
                        Đăng Ký
                    </button>
                </div>
                <div className={styles.form}>
                    {isLogin ? (
                        <LoginForm onGetPassword={onGetPassword} onCloseModal={onCloseModal} />
                    ) : (
                        <RegisterForm setIsLogin={setIsLogin}/>
                    )}
                </div>
            </BaseModal >
        ) : ( 
            <BaseModal
                isOpen={isPassword}
                onClose={() => onCloseModal()}
                bodyClass={styles.modalBody}
                headerClass={styles.modalHeader}
                onConfirm={() => onConfirmPassword()}
                onCancel={() => onCancelPassword()}
                confirmButtonLabel='Tiếp tục'
                cancelButtonLabel='Hủy'
                footerClass={styles.modalFooter}
                disabledBtn={disabledBtn}
                typeBtn = 'submit'
            >
                {!isNewPassword ? (<>
                    <div className={styles.tab}>
                        <button type="button" className={styles.active} >
                            Quên mật khẩu
                        </button>
                        <p>Nếu bạn quên mật khẩu, vui lòng nhập lại địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi cho bạn mã OTP để thực hiện bước tiếp theo.</p>
                    </div>
                    <div className={styles.form}>
                        <BasicForm 
                            initialValues={{ email: "" }} 
                            formikRef = { formRef }
                            validationSchema={Yup.object().shape({
                                email: Yup.string().required(authenticationMessages.emailInvalid).matches(emailRegExp, authenticationMessages.emailInvalid)
                                .required(authenticationMessages.requiredField),
                            })}
                        >
                            <InputTextField placeholder="Nhập địa chỉ email" name="email" />
                            <span style={{color: 'red', fontSize: 14 }}>{errorForget}</span>
                        </BasicForm>
                    </div>
                </>
                ) : (
                <>
                    <div className={styles.tab}>
                        <button type="button" className={styles.active} >
                            Tạo mật khẩu mới
                        </button>
                        <p>Cảm ơn bạn đã trở lại. Vui lòng nhập chi tiết mật khẩu dưới đây.</p>
                    </div>
                    <div className={styles.form}>
                        <BasicForm 
                            initialValues={{ 
                                email: "", 
                                password: "",
                                rePassword: "", 
                            }} 
                            formikRef = { formRef }
                            validationSchema={Yup.object().shape({
                                email: Yup.string().required(authenticationMessages.emailInvalid).matches(emailRegExp, authenticationMessages.emailInvalid)
                                .required(authenticationMessages.requiredField),
                                password: Yup.string()
                                .required(authenticationMessages.requiredField)
                                .min(8, 'Mật khẩu phải trên 8 ký tự'),
                                rePassword: Yup.string()
                                    .oneOf([Yup.ref('password'), null],'Mật khẩu không trùng khớp')
                                    .required(authenticationMessages.requiredField),
                                code: Yup.string()
                                    .required('Vui lòng nhập OTP')
                                    .min(5, 'OTP phải đủ 5 ký tự')
                                    .max(5, 'OTP phải đủ 5 ký tự'),
                            })}
                            onSubmit={()=>{}}
                        >
                            <InputTextField label="Email" placeholder="Email" name="email" disabled required/>
                            <InputTextField label="OTP" placeholder="Nhập OTP " name="code" required/>
                            <InputTextField label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" name="password" type="password" required/>
                            <InputTextField label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu" name="rePassword" type="password" required/>
                            <span style={{color: 'red', fontSize: 14 }}>{errorForget}</span>
                        </BasicForm>
                    </div>
                </>
                )}
            </BaseModal>
            
        )
    )
}

export default AuthencationModal;