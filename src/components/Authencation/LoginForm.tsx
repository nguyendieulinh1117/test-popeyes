import React, { useContext, useState } from 'react';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import styles from './LoginForm.module.scss';
import BasicForm from '@@@Form/BasicForm';
import InputTextField from "@@@Form/InputTextField";
import Button from "@@@Form/Button";
import { authActions } from '@redux/actions';
import { phoneRegExp } from '@constants';
import { useRouter } from 'next/router';

const LoginForm = (props: any) => {
    const { onGetPassword, onCloseModal } = props;
    const dispatch = useDispatch();
    const router = useRouter();

    const [error, setError] = useState<string>();
    const [disabled, setDisabled] = useState<boolean>(false);

    const LoginFormik = {
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            username: Yup.string()
                .required('Vui lòng không bỏ trống').matches(phoneRegExp, 'Vui lòng nhập đúng định dạng số điện thoại'),
            password: Yup.string()
                .required('Vui lòng không bỏ trống')
                .min(8, 'Mật khẩu phải có ít nhất 8 kí tự'),
        }),
        onSubmit: (params: any) => {
            setDisabled(true)
            setError('');
            let paramsPost = { ...params, grantType: "Password", username: '+84' + params.username.slice(1) };
            dispatch(authActions.logIn({
                params: paramsPost,
                onCompleted: (res: any) => {
                    if (res.success) {
                        onCloseModal();
                        toast.success('Đăng nhập thành công');
                    }
                    setTimeout(() => {
                        setDisabled(false)
                        router.reload();
                    }, 500);
                },
                onError: (error: any) => {
                    toast.warn('Đăng nhập thất bại');
                    setError('Thông tin tài khoản hoặc mật khẩu chưa chính xác!');
                    setDisabled(false)
                }
            }))
        }
    }
    return (
        <BasicForm
            initialValues={LoginFormik.initialValues}
            validationSchema={LoginFormik.validationSchema}
            onSubmit={LoginFormik.onSubmit}
        >
            <InputTextField 
                label="Tài khoản"
                placeholder="Nhập số điện thoại"
                onChange={() => setError('')}
                name="username" 
                required 
            />
            <InputTextField 
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                name="password"
                onChange={() => setError('')}
                type="password" 
                required 
            />
            <button
                type="button"
                onClick={() => onGetPassword()}
            >
                <p>Quên mật khẩu?</p>
            </button>
            <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>
            <div className={styles.btn}>
                <Button type='submit' fullWidth={true} buttonStyle="secondary" disabled={disabled}> Đăng Nhập </Button>
            </div>
        </BasicForm>
    );
}

export default LoginForm;