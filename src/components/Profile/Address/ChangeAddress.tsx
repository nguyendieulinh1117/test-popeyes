import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDispatch } from "react-redux";
import Select, { CSSObjectWithLabel } from "react-select";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

//component
import BasicForm from "@components/Common/Form/BasicForm";
import InputTextField from "@components/Common/Form/InputTextField";
import Button from '@components/Common/Form/Button';
import CheckboxField from '@components/Common/Form/CheckBoxField';
import { Mobile, Desktop } from '@components/Common/Media';
import Notification from '../Notification';
import { addressActions, storeActions } from "@redux/actions";
import { authenticationMessages } from '@constants/defineMessage';
import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths, phoneRegExp } from '@constants';

import IconLeft from "@assets/icons/arrow-left.svg";
import style from './ChangeAddress.module.scss';

type Props = {
    isUpdate?: boolean;
}

const styleSelect = {
    control: (provided: any, state: any) => ({
        ...provided,
        minHeight: '40px',
        borderRadius: '8px'
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#8A8A8A",
        fontSize: '14px',
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#8A8A8A",
    }),
};

const CreateOrUpdateAddress = (props: Props) => {
    const { isUpdate } = props;
    const dispatch = useDispatch();
    const {query, push} = useRouter();
    
    const formRef = useRef<any>(null)

    const { arrProvinces }: any = useSelectorTyped((store) => store.store);
    const { addressBooks }: any = useSelectorTyped((state) => state.address);
    const addressIsUpdate = addressBooks?.find((find: any) => find?.id === parseInt(query.id as string));
    const addressDefault = addressBooks?.find((find: any) => find?.isDefault);

    const [isDirty, setIsDirty] = useState(true);
    const [provinceSelected, setProvinceSelected] = useState<any>()
    const [districtOptions, setDistrictOptions] = useState<any[]>()
    const [districtSelected, setDistrictSelected] = useState<any>()
    const [wardOptions, setWardOptions] = useState<any[]>()
    const [wardSelected, setWardSelected] = useState<any>()

    const provinceOptions = arrProvinces && Object.values(arrProvinces)?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
        districts: item?.districts,
    }));

    const selectDistrictByProvince = (data: any) => {
        const districts = data?.map((item: any) => {
            return {
                label: item?.name,
                value: item?.id,
                wards: item?.wards,
            }
        })
        setDistrictOptions(districts);
    }

    const selectWardByDistrict = (data: any) => {
        const ward = data?.map((item: any) => {
            return {
                label: item?.name,
                value: item?.id,
            }
        })
        setWardOptions(ward);
    }

    const onChangeProvince = (province: any) => {
        setDistrictSelected(null);
        setWardSelected(null);
        setWardOptions(undefined);
        setProvinceSelected(province);
        selectDistrictByProvince(province.districts);
        setIsDirty(false);
    }

    const onChangeDistrict = (district: any) => {
        setDistrictSelected(district);
        selectWardByDistrict(district?.wards);
        setIsDirty(false);
    }

    const onChangeWard = (ward: any) => {
        setWardSelected(ward);
        setIsDirty(false);
    }

    const checkIsDefault = () => {
        if(!addressDefault){
            return;
        }
        
        dispatch(addressActions.updateAddress({
            params: { 
                ...addressDefault,
                isDefault: false,
            },
            onCompleted: (res: any) => {
                if (res.success) {
                    if(res.data.isDefault){
                        dispatch(addressActions.getAddress({ 
                             id: query.id
                        }))
                    }
                }
            },
            onError: () => { }
        }))
    };

    const onSubmitForm = (params: any) => {
        if(!wardSelected || !districtSelected || !provinceSelected){
            toast.warning("Vui lòng chọn Thành phố / Quận huyện / Phường xã!");
        }
        let parameters = {
            name: params.name,
            fullAddress: `${params.address}, ${wardSelected.label}, ${districtSelected.label}, ${provinceSelected.label}`,
            address: params.address,
            wardId: wardSelected?.value,
            ward: wardSelected?.label,
            districtId: districtSelected?.value,
            district: districtSelected?.label,
            provinceId: provinceSelected?.value,
            province: provinceSelected?.label,
            phone: params.phone,
            isDefault: params?.isDefault,
            customerName: params.name,
        } 

        if(params?.isDefault){
            checkIsDefault();
        }

        if(isUpdate){
            dispatch(addressActions.updateAddress({
                params: { 
                    ...parameters,
                    id: query.id,
                 },
                onCompleted: (res: any) => {
                    if (res.success) {
                        toast.success('Cập nhật thành công');
                        if(res.data.isDefault){
                            dispatch(addressActions.getAddress({ 
                                 id: query.id
                            }))
                        }
                    }
                },
                onError: (error: any) => { }
            }))
            return;
        }
        dispatch(addressActions.addAddress({
            params: { 
                ...parameters, 
            },
            onCompleted: (res: any) => {
                if (res.success) {
                    push(paths.profile.address);
                }
            },
            onError: (error: any) => { }
        }))
    }

    const onSetDefault = () =>{
        if(addressIsUpdate?.isDefault){
            toast.warn('Tồn tại ít nhất 1 địa chỉ mặc định');
            return;
        }
    }

    useEffect(() => {
        dispatch(storeActions.getProvinces());
    }, [])

    useEffect(() => {
        const tempProvinces = arrProvinces?.find((find: any) => find.id === addressIsUpdate?.provinceId);
        const tempDistrict = tempProvinces?.districts?.find((find: any) => find.id === addressIsUpdate?.districtId);
        const tempWard = tempDistrict?.wards?.find((find: any) => find.id === addressIsUpdate?.wardId);
        
        if(query.id){
            setProvinceSelected({ label: tempProvinces?.name, value: tempProvinces?.id });
            setDistrictSelected({ label: tempDistrict?.name, value: tempDistrict?.id });
            setWardSelected({ label: tempWard?.name, value: tempWard?.id });
        }
            
        selectDistrictByProvince(tempProvinces?.districts);
        selectWardByDistrict(tempDistrict?.wards);
        
        if (formRef.current) {
            let data = {
                name: addressIsUpdate?.name || "",
                phone: addressIsUpdate?.phone || "",
                isDefault: addressIsUpdate?.isDefault || false,
                address: addressIsUpdate?.address || "",
            }
            formRef.current.setValues(data);
        }
    }, [addressBooks, arrProvinces])

    useEffect(() => {
        dispatch(addressActions.getAddress());
    }, [query.id]);

    return (
        <div className={style.info}>
            <Desktop>
                <Notification />
            </Desktop>
            <div className={style.centerForm}>
                <div className={style.titleForm}>
                    {isUpdate ? 'CHỈNH SỬA ĐỊA CHỈ' : 'THÊM ĐỊA CHỈ MỚI'}
                    <Mobile>
                        <Link href={paths.profile.address} passHref>
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
                    formikRef={formRef}
                    validationSchema={Yup.object().shape({
                        name: Yup.string()
                            .required(authenticationMessages.nameInvalid).required(authenticationMessages.requiredField),
                        address: Yup.string()
                            .required(authenticationMessages.nameInvalid).required(authenticationMessages.requiredField),
                        phone:Yup.string().required(authenticationMessages.requiredInvalid).matches(phoneRegExp, authenticationMessages.phoneInvalid)
                            .required(authenticationMessages.requiredField),
                    })}
                    onSubmit={onSubmitForm}
                    onChange={()=>{setIsDirty(false)}}
                >
                    <div className={style.column}>
                        <InputTextField label="Tên " placeholder="Nhập tên" name="name" required/>
                        <InputTextField label="Số điện thoại" placeholder="Nhập số điện thoại" name="phone" required/>
                    </div>
                    <div className={style.column}>
                        <div className={style.selectGroup}>
                            <label>Tỉnh/ Thành phố</label>
                            <Select
                                placeholder="Tỉnh/ Thành phố"
                                options={provinceOptions}
                                name="province"
                                styles={styleSelect}
                                components={{ IndicatorSeparator: () => null }}
                                className={style.select}
                                onChange={onChangeProvince}
                                value={provinceSelected}
                            />
                            <label>Quận</label>
                            <Select
                                placeholder="Quận"
                                options={districtOptions}
                                name="district"
                                styles={styleSelect}
                                components={{ IndicatorSeparator: () => null }}
                                className={style.select}
                                onChange={onChangeDistrict}
                                value={districtSelected}
                            />
                            <label>Phường/ Xã</label>
                            <Select
                                placeholder="Phường/ Xã"
                                options={wardOptions}
                                name="ward"
                                styles={styleSelect}
                                components={{ IndicatorSeparator: () => null }}
                                className={style.select}
                                onChange={onChangeWard}
                                value={wardSelected}
                            />
                        </div>
                        <InputTextField label="Địa chỉ nhận hàng " placeholder="Nhập địa chỉ" name="address" required/>
                        <div className={style.checkCurrent}  onClick={() => onSetDefault()}>
                            <CheckboxField
                                name="isDefault"
                                // disabled={addressIsUpdate?.isDefault ? 'disabled' : null}
                            >
                                Đặt làm địa chỉ mặc định
                            </CheckboxField>
                        </div>
                        <div className={style.btnGroup}>
                            <Button 
                                buttonStyle="secondary" 
                                className={style.btnSubmit} 
                                type="submit"
                                disabled={isDirty}
                            >
                                {isUpdate ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Link href={paths.profile.address} passHref>
                                <Button className={style.btnSubmit}>
                                    Hủy
                                </Button>
                            </Link>
                        </div>
                    </div>
                </BasicForm>
            </div>
        </div>
    );
}

export default CreateOrUpdateAddress;