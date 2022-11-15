import React, { useContext } from 'react';
import style from './index.module.scss';
import Link from 'next/link';
import * as Yup from "yup";

//component
import BasicForm from "@components/Common/Form/BasicForm";
import InputTextField from "@components/Common/Form/InputTextField";
import IconLeft from "@assets/icons/arrow-left.svg";
import Button from '@components/Common/Form/Button';
import { Mobile, Desktop } from '@components/Common/Media';
import { paths } from '@constants';
import Notification from '../Notification';
import { useDispatch } from 'react-redux';
import { authActions } from '@redux/actions';
import { ProfileContext } from '../ProfileContext';
import { authenticationMessages } from '@constants/defineMessage';

const messages ={
    passwordMustMoreThan8Characters: 'Mật khẩu phải trên 8 ký tự',
    passwordNotMatch: 'Mật khẩu không trùng khớp',
    newPassword: 'Mật khẩu mới',
    enterNewPassword: 'Nhập mật khẩu mới',
    currentPassword: 'Mật khẩu hiện tại',
    enterCurrentPassword: 'Nhập mật khẩu hiện tại',
    confirmPassword: 'Nhập lại mật khẩu mới',
    success: 'Thành công',
    failure: 'Thất bại',
    oldPasswordWrong: 'Mật khẩu cũ không chính xác!'
}

const ChangePassword = () => {

    const dispatch = useDispatch();
    const {Noti} = useContext(ProfileContext);

    const onSubmitForm = (params: any, {resetForm}: any) =>
    {
        dispatch(authActions.changePassword({
            params,
            onCompleted: (res: any)=>{
                if(res.success){
                    Noti().success('Cập nhật thông tin tài khoản thành công.')
                    resetForm();
                }else{
                    Noti().error('Cập nhật thông tin tài khoản thất bại.')
                }
            }, 
            onError : (error: any)=>{
                Noti().error('Cập nhật thông tin tài khoản thất bại.')
            }
        }))
    }

    return ( 
        <div className={style.changePassword}>
            <Desktop>
                <Notification />
            </Desktop>
            <div className={style.centerForm}>
                <div className={style.titleForm}>
                    thay đổi mật khẩu
                    <Mobile>
                        <Link href={paths.profile.information} passHref>
                            <div className={style.returnBtn}>
                                <IconLeft />
                            </div>
                        </Link>
                    </Mobile>
                </div>
                <Mobile>
                    <Notification />
                </Mobile>
                <BasicForm
                    initialValues={{
                        password: "",
                        newPassword: "",
                        rePassword: "",
                    }}
                    onSubmit={onSubmitForm}
                    validationSchema={Yup.object().shape({
                        password: Yup.string()
                            .required(authenticationMessages.requiredField)
                            .min(8, messages.passwordMustMoreThan8Characters),
                        newPassword: Yup.string()
                            .required(authenticationMessages.requiredField)
                            .min(8, messages.passwordMustMoreThan8Characters),
                        rePassword: Yup.string()
                            .oneOf([Yup.ref('newPassword'), null],messages.passwordNotMatch)
                            .required(authenticationMessages.requiredField),
                    })}
                >
                    <InputTextField label="Mật khẩu hiện tại" placeholder="Nhập mật khẩu cũ" name="password"  type="password" required/>
                    <InputTextField label="Mật khẩu mới" placeholder="Nhập mật khẩu" name="newPassword"  type="password" required/>
                    <InputTextField label="Nhập lại" placeholder="Nhập lại mật khẩu mới" name="rePassword"  type="password" required/>
                    <Button buttonStyle="secondary" className={style.btnSubmit} type='submit'>
                        LƯU THAY ĐỔI
                    </Button>
                </BasicForm>
            </div>
        </div>
    );
}

export default ChangePassword;