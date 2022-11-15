import React, { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import styles from './RegisterForm.module.scss';
import BasicForm from '@@@Form/BasicForm';
import InputTextField from "@@@Form/InputTextField";
import Button from "@@@Form/Button";
import { ErrorMessage } from 'formik';
import {authActions} from '@redux/actions';
import { numberRegExp } from '@constants';
import { authenticationMessages } from '@constants/defineMessage';

const RegisterForm = ({ setIsLogin }: any) => {
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState<boolean>(false)
    
    const RegisterFormik = {
      initialValues: {
        fullName: "",
        phone: "",
        email: "",
        password: "",
        rePassword: "",
      },
      validationSchema: Yup.object().shape({
        fullName: Yup.string().required("Vui lòng không bỏ trống"),
        phone: Yup.string().required("Vui lòng không bỏ trống").matches(numberRegExp, authenticationMessages.phoneInvalid)
        .required(authenticationMessages.requiredField),
        email: Yup.string()
            .required("Vui lòng không bỏ trống")
            .email("Email không đúng định dạng"),
        password: Yup.string()
          .required("Vui lòng không bỏ trống")
          .min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
        rePassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Mật khẩu xác thực không khớp")
          .required("Vui lòng không bỏ trống"),
      }),
      onSubmit: (params: any) => {
        setDisabled(true)

        dispatch(
          authActions.register({
            params,
            onCompleted: (res: any) => {
              toast.success('Đăng Ký Thành Công')
              setIsLogin(true);
              dispatch(authActions.logIn({
                params: { password: params.password , grantType: "Password", username: '+84' + params.phone.slice(1) },
                onCompleted: (res: any) => {
                    if (res.success) {
                        // toast.success('Đăng nhập thành công');
                        setTimeout(() => {
                          setDisabled(false)
                          window.location.reload();
                        }, 500);
                    }
                },
                onError: (error: any) => {
                    setIsLogin(true);
                }
              }))
            },
            onError: (error: any) => {
              setIsLogin(true);
              if(error?.errorCode==='600'){
                toast.error(`Đăng Ký Thất Bại số ${params?.phone} đã tồn tại`)
              }
            },
          })
        );
      },
    };
    return ( 
        <BasicForm
            initialValues={RegisterFormik.initialValues}
            validationSchema={RegisterFormik.validationSchema}
            onSubmit={RegisterFormik.onSubmit}
        >
            <InputTextField label="Họ và tên" placeholder="Nhập họ và tên" name="fullName" required/>
            <InputTextField label="Số điện thoại" placeholder="Nhập số điện thoại" name="phone" required/>
            <InputTextField type='email' label="Địa chỉ email" placeholder="Nhập địa chỉ email" name="email"  required/>
            <InputTextField type="password" label="Mật khẩu" placeholder="Nhập mật khẩu" name="password" required/>
            <InputTextField type="password" label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu" name="rePassword" required/>
            <div className={styles.btn}>
                <Button type='submit' fullWidth={true} buttonStyle="secondary" > Đăng ký </Button>
            </div>
        </BasicForm>
     );
}

export default RegisterForm;