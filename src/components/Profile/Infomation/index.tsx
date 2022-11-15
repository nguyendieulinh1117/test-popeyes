import React, { useContext, useEffect, useRef, useState } from 'react';
import style from './index.module.scss';
import Link from 'next/link';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';

//component
import BasicForm from "@components/Common/Form/BasicForm";
import InputTextField from "@components/Common/Form/InputTextField";
import IconRight from "@assets/icons/arrow-right.svg";
import IconLeft from "@assets/icons/arrow-left.svg";
import Button from '@components/Common/Form/Button';
import { emailRegExp, numberRegExp, paths } from '@constants';
import { Desktop, Mobile } from '@components/Common/Media';
import { authenticationMessages } from '@constants/defineMessage';
import { authActions } from '@redux/actions';
import Notification from '../Notification';

//Noti
import { ProfileContext } from '../ProfileContext';



const Information: React.FC<any> = ({profile}) => {
    const dispatch = useDispatch();

    const formRef = useRef<any>(null)
    
    const onSubmit = (params: any) => {
        dispatch(authActions.updateProfile({
            params,
            onCompleted: (res: any)=>{
                if(res.success){
                    Noti().success('Cập nhật thông tin tài khoản thành công.');
                    setIsDirty(true);
                    dispatch(authActions.getProfile());
                }else{
                    Noti().error('Cập nhật thông tin tài khoản thất bại.')
                }
            }, 
            onError : (error: any)=>{
                Noti().error('Cập nhật thông tin tài khoản thất bại.')
            }

        }));

    }

    useEffect(() => {
        if (formRef.current) {
            let data = {
                fullName: profile.fullName,
                phone: profile.phone,
                email: profile.email
            }
            formRef.current.setValues(data);
        }
    }, [profile]);

    const {Noti} = useContext(ProfileContext);
    const [isDirty, setIsDirty] = useState(true);
    return ( 
        <div className={style.info}>
            <Desktop>
                <Notification />
            </Desktop>
            <div className={style.centerForm}>
                <div className={style.titleForm}>
                    THÔNG TIN TÀI KHOẢN
                    <Mobile>
                        <Link href={paths.profile.index} passHref>
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
                    formikRef = {formRef}
                    validationSchema={Yup.object().shape({
                        fullName: Yup.string()
                            .required(authenticationMessages.nameInvalid).required(authenticationMessages.requiredField),
                        phone:Yup.string().required(authenticationMessages.requiredInvalid).matches(numberRegExp, authenticationMessages.phoneInvalid)
                            .required(authenticationMessages.requiredField),
                        email: Yup.string().required(authenticationMessages.requiredInvalid).matches(emailRegExp, authenticationMessages.emailInvalid)
                        .required(authenticationMessages.requiredField)
                    })}
                    onSubmit = {onSubmit}
                    onChange={()=>{setIsDirty(false)}}
                >
                    <InputTextField label="Họ và tên" placeholder="Nhập họ và tên" name="fullName" required  />
                    <InputTextField label="Số điện thoại" placeholder="Nhập số điện thoại" name="phone" required/>
                    <InputTextField label="Địa chỉ email" placeholder="Nhập địa chỉ email" name="email" required/>
                    <Link href={paths.profile.changePassword} passHref>
                        <div className={style.directInput}>
                            <InputTextField disabled label="Mật khẩu" placeholder="Cập nhật mật khẩu" name="password" iconRight={<IconRight />} />
                        </div>
                    </Link>
                    <Link href={paths.profile.address} passHref>
                        <div className={style.directInput}>
                            <InputTextField disabled label="Sổ địa chỉ" placeholder="Bấm để xem và quản lý địa chỉ" name="address" iconRight={<IconRight />} />
                        </div>
                    </Link>
                    <Button 
                        buttonStyle="secondary" 
                        className={style.btnSubmit} 
                        type="submit" 
                        disabled={isDirty}
                    >
                        Cập nhật
                    </Button>
                </BasicForm>
            </div>
        </div>
    );
}

export default Information;