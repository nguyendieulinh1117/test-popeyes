import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Select, { CSSObjectWithLabel } from "react-select";
import classNames from "classnames";
import moment from "moment";

import { addressActions, basketActions, deliveryActions, orderActions, paymentActions } from "@redux/actions";
import { parseArrDataToSelectOption, sortBoolean } from "@utils";
import { numberRegExp, paths, storageKeys } from "@constants";
import { authenticationMessages } from "@constants/defineMessage";
import { useSelectorTyped } from "@hooks/useSelectorType";


import BasicForm from "@@@Form/BasicForm";
import InputTextField from "@@@Form/InputTextField";
import RadioBoxField from "@@@Form/RadioBoxField";

import Button from "@@@Form/Button";

import CheckboxField from "@components/Common/Form/CheckBoxField";
import InfoForm from "./InfoForm";

import IconAdd from "@assets/icons/add.svg";
import styles from "./CheckOutForm.module.scss";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { removeItem } from "@utils/localStorage";
import useBasketCheckOut from "@hooks/useBasketCheckOut";
import BaseModal from "@components/Common/Modal";
import { addPaymentInfoFunc, addShippingInfoFunc, beginCheckoutFunc, purchaseFunc } from "@utils/measureEcommerceGA";

const styleSelect = {
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#292929",
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#292929",
    }),
    control: (base: CSSObjectWithLabel) => ({
        ...base,
        borderRadius: "8px"
    }),
    menu:(base: CSSObjectWithLabel) => ({
        ...base,
        zIndex: 4
    }),
};

const initValueForm = {
    firstName: "",
    phone: "",
    address: "",
    note: "",
    saveAddress: true,
    paymentMethod: ''
}

const deliveryData = [
    {
        label: 'Giao hàng nhanh',
        value: 'Ghn',
        icon: 'icons/giao-hang-nhanh.png',
        id: 1,
    },
    {
        label: "Supper ship",
        value: 'SuperShip',
        icon: 'icons/supper-ship.png',
        id: 2
    }
]

const UnAuthForm: React.FC<any> = ({ isAuthenticated, user }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {push} = useRouter();
    const {basketId} = useBasketCheckOut();

    const { basketData, checkStockData } = useSelectorTyped((state) => state.basket);
    const {arrProvinces} = useSelectorTyped(state => state.store);
    const {addressBooks} = useSelectorTyped(state => state.address);
    const {paymentMethods} = useSelectorTyped(state => state.payment);
    const { deliveryFee, deliveryFeeErr} = useSelectorTyped((state) => state.delivery);
    
    const paymentFillters = paymentMethods.filter((payment: any) => payment.isActive);
  
    const [timeOutSearch, setTimeOutSearch] = useState<any>(0);

    const [selectedProvinceOption, setSelectedProvinceOption] = useState<any>();
    const [selectedDistrictOption, setSelectedDistrictOption] = useState<any>();
    const [selectedWardOption, setSelectedWardOption] = useState<any>();

    const [checkedOptionAddress, setCheckedOptionAddress] = useState<string>();
    const [checkedPaymentMethod, setCheckedPaymentMethod] = useState<string>();
    const [checkedDeliveryMethod, setCheckedDeliverMethod] = useState<string>();//deliveryData[0].value

    const [districtOptions, setDistrictOptions] = useState<any[]>([]);
    const [wardOptions, setWardOptions] = useState<any[]>([]);

    const [errorAddress, setErrorAddress] = useState<string>();
    const [add, setAdd] = useState<boolean>(false);

    const [disabledBtn, setDisabledBtn] = useState<boolean>(false);

    const provinceOptions = parseArrDataToSelectOption(arrProvinces, 'districts');

    const [show, setShow] = useState<boolean>(false);
    const [isDeliveryFeeErr, setIsDeliveryFeeErr] = useState<boolean>(deliveryFeeErr);


    useEffect(()=>{
        const valuePaymentMethod = paymentFillters?.find((payment: any) => payment.isDefault);
        setCheckedPaymentMethod(valuePaymentMethod?.code||undefined);
    },[paymentMethods])
    useEffect(()=>{
        setIsDeliveryFeeErr(deliveryFeeErr);
    }, [deliveryFeeErr])

    useEffect(()=>{
        const valueAddressBook = addressBooks?.find((address: any) => address.isDefault);
        setCheckedOptionAddress(valueAddressBook?.id?.toString()||undefined);
    },[addressBooks])

    const onChangeProvince = (province: any) => {
        if (!province) return;
        setSelectedDistrictOption(null)
        setSelectedWardOption(null)
        setSelectedProvinceOption(province);
        setDistrictOptions(parseArrDataToSelectOption(province.childrens, 'wards'))
    }

    const onChangeDistrict = (district: any) => {
        if (!district) return;
        setSelectedDistrictOption(district);
        setWardOptions(parseArrDataToSelectOption(district.childrens))
    }

    const onChangeWard = (ward: any) => {
        if (!ward) return;
        setSelectedWardOption(ward);
        handleApiDelivery(ward);
    }

    const onUpdatePayment = (value: any) => {
        setCheckedPaymentMethod(value);
    };

    const mergeAddress = (value: string) => {
        if (!selectedWardOption || !selectedProvinceOption || !selectedDistrictOption) {
            return {
                status: false,
                address: ''
            }
        }

        return {
            status: true,
            address: `${value},${selectedWardOption.label}, ${selectedDistrictOption.label}, ${selectedProvinceOption.label}  `
        }
    }

    const radioAddressData = () => {
        if (!addressBooks.length) {
            return [];
        }
        
        return sortBoolean(addressBooks, 'isDefault')?.map((address: any, index: number) => {
            return {
                label: (
                    <div key={`address_${index}`} className={styles.infoGroup}>
                        <div className={styles.info}>
                            <h6>{address.name}</h6>
                            <div className={styles.address}>
                                <p>{address.fullAddress}</p>
                                <p>Điện thoại: {address.phone}</p>
                            </div>
                        </div>
                        {address.default ? <div className={styles.default}>Mặc định</div> : undefined}
                    </div>
                ),
                value: address.id.toString(),

            };
        })
    };

    const paymentMethodData = () => {
        return paymentFillters?.map((payment: any) => {
            return {
                label: payment.name,
                value: payment.code,
                icon:  payment.icon,
            }
        });
    }

    const handleApiDelivery = (ward?, delivery?, addressId?) => {
        let shippingInfo: any = null;

        if (isAuthenticated && !add) {
            const info = addressBooks.find((address: any) => {
                let idAddRess = addressId? addressId : checkedOptionAddress
                return address.id.toString() === idAddRess;
            });
            if (!info) {
                return;
            }
            shippingInfo = {
                "toProvince": info.province,
                "toDistrict": info.district,
                "toWard": info.ward
            }
        } else {
            
            if (!selectedProvinceOption || !selectedDistrictOption || (!ward && !selectedWardOption)) 
            {
                return;
            }
            shippingInfo = {
                "toProvince": selectedProvinceOption.label,
                "toDistrict": selectedDistrictOption.label,
                "toWard": ward? ward.label : selectedWardOption.label
            }
        }


        if (!shippingInfo || (!checkedDeliveryMethod && !delivery)) {
            return
        }
        dispatch(deliveryActions.deliveryCalculateFee({
            ...shippingInfo,
            "deliveryMethod": delivery? delivery : checkedDeliveryMethod,
            "insuranceValue": (basketData?.totalPrice - basketData?.totalDiscount) || 0
        }))

        // dispatch(deliveryActions.deliveryServices({
        //     params: {
        //         ...shippingInfo,
        //         "deliveryMethod": delivery? delivery : checkedDeliveryMethod
        //     },
        //     onCompleted:(res: any) => {
        //         if(!!res?.data[0]){
        //             let service = res?.data[0];
        //             
        //         }else{
        //             toast.error('Qúa trình tính phí vận chuyển bị lỗi!')
        //             setCheckedDeliverMethod(undefined)
        //         }
        //     },
        //     onError:()=>{
        //         toast.error('Qúa trình tính phí vận chuyển bị lỗi!')
        //         setCheckedDeliverMethod(undefined)
        //     },
        // }))
    }

    const onUpdateAddress = (value: any) => {
        setCheckedOptionAddress(value)
        handleApiDelivery(null, null, value);        
    };

    const validateForm = () => {
        let res: any =  {
            firstName: Yup.string().required(authenticationMessages.requiredField),
            phone: Yup.string()
                .matches(numberRegExp, authenticationMessages.phoneInvalid)
                .required(authenticationMessages.requiredField),
            address: Yup.string().required(authenticationMessages.requiredField)
        };
        if(isAuthenticated && !add ){
            res = {}
        }
        return res;
    }

    const setTimeOutPush = (paths: string, seconds: number = 500) => {
        setTimeout(()=>{
            push(paths);
        },seconds)
    }

    const deleteBasket = () => {
        removeItem(storageKeys.BASKET_ID);

        dispatch(basketActions.deleteBasket({
            params:{
                id: basketId
            },
            onCompleted: () => {},
            onError: () => {}

        }))
        dispatch(basketActions.clearDataBasket());
       
    }

    const onCompletePostPayment = (res: any, orderDetail: any) => {
        setDisabledBtn(false)
        deleteBasket();

        if(!res.success){
            onErrorOrder();
            setTimeOutPush(`${paths.orderFail}?orderId=${orderDetail.code}`);
            return ;
        }
        const paymentDetail = res.data;
        const { payUrl, paymentMethod, qrCodeUrl, amount } = paymentDetail;
        
        if (paymentMethod?.code === "COD") {
            purchaseFunc(orderDetail)
            push(`${paths.orderSuccess}?orderId=${orderDetail.code}`);

        } else if (paymentMethod?.code === "ShopeePay") {
            push(
                `shopeepay?qrCode=${qrCodeUrl}&code=${orderDetail.code}&amount=${amount}`
            );
        } else {
            window.open(payUrl);
            // push(payUrl);
        }
    };
  
    const onErrorOrder = () => {
        toast.error("Đã xảy ra lỗi khi đặt hàng.")
    }

    const onCompletedOrder = (res: any) => {
        clearTimeout(timeOutSearch);

        setTimeOutSearch(setTimeout(() => {
            if(!res.success){
                toast.error("Đã xảy ra lỗi khi đặt hàng.")
                setTimeOutPush(paths.orderFail);
                return;
            }
            toast.success("Đặt hàng thành công.");
            // setTimeOutPush(`${paths.orderSuccess}?orderId=${res.data.code}`);
            const orderDetail = res.data;
            const orderCode = orderDetail.code;
            //TODO call api payment
            dispatch(paymentActions.orderPayment({
                params:{
                    orderCode,
                    paymentMethod: checkedPaymentMethod,
                    redirectUrl: `${window.location.origin}${paths.orderSuccess}`,
                },
                onCompleted: (res:any)=> onCompletePostPayment(res, orderDetail),
                onError: () => {
                    setDisabledBtn(false)
                    onErrorOrder();
                    setTimeOutPush(`${paths.orderFail}?orderId=${orderDetail.code}`);
                },
            }))
        }, 500));

        
    }

    const saveAddressProfile = (params: any) => {
        
        const parameters = {
            name: params.firstName,
            fullAddress: params.fullAddress,
            address: params.address,
            wardId: selectedWardOption?.value,
            ward: selectedWardOption?.label,
            districtId: selectedDistrictOption?.value,
            district: selectedDistrictOption?.label,
            provinceId: selectedProvinceOption?.value,
            province: selectedProvinceOption?.label,
            phone: params.phone,
            isDefault: params?.isDefault,
            customerName: params.firstName,
        } 

        dispatch(addressActions.addAddress({
            params: { 
                ...parameters, 
            },
            onCompleted: (res: any) => {},
            onError: (error: any) => {}
        }))
    }  
   
    const onSubmitForm = (values: any) => {
        
        let infomation: any = null;
        let shippingInfo: any = null;
        setErrorAddress(undefined)

        if (isAuthenticated && !add) {
            if (!checkedOptionAddress) {
                setErrorAddress('Vui lòng chọn địa chỉ.');
                return;
            }

            const info = addressBooks.find((address: any) => {
                return address.id.toString() === checkedOptionAddress;
            });

            if(!info){
                toast.error('Vui lòng chọn địa chỉ trước khi đặt hàng');
                return;
            }

            infomation = {
                phone: info.phone,
                firstName: info.name,
                lastName: info.customerName,
                address: info.fullAddress,
            }

            shippingInfo = {
                ...infomation,
                provinceId: info.provinceId,
                districtId: info.districtId,
                wardId: info.wardId,
                deliveryId: deliveryData.find(( del:any ) => del.value === checkedDeliveryMethod)?.id || null
            }
        } else {
            const { status, address } = mergeAddress(values.address);
            if (!status) {
                setErrorAddress('Vui lòng chọn đầy đủ thông tin.')
                return;
            }
            infomation = {
                phone: values.phone,
                firstName: values.firstName,
                lastName: values.firstName,
                address: address,
            }

            shippingInfo = {
                ...infomation,
                provinceId: selectedProvinceOption.value,
                districtId: selectedDistrictOption.value,
                wardId: selectedWardOption.value,
                deliveryId: deliveryData.find(( del:any ) => del.value === checkedDeliveryMethod)?.id || null
            }

            if(isAuthenticated && add && values?.saveAddress){
                saveAddressProfile({...infomation, fullAddress: infomation.address, ...values})
            }
        }
        
        if(!checkedDeliveryMethod){
            toast.error("Vui lòng chọn phương thức vận chuyển");
            return;
        }

        if (isAuthenticated) {
            infomation = {
                ...infomation,
                phone: user?.phone,
                firstName: user?.fullName,
                lastName: user?.fullName,
            }
        }
        
        const now = moment().utc().format();

        const params = {
            basketId: basketId,
            customer: infomation,
            shippingInfo: {
                ...shippingInfo,
                createdTime: now,
                expectedDeliveredTime: now,
                amount: deliveryFee || 0
            },
            note: values.note,
            getAccessories: true,
            createdSource: "WebApp"
        };
        
        let err: boolean = false;
        let err1: boolean = false;
        let dataCB: any[] =[]
        basketData.products.map((e) => {
            return dataCB.push(e)
        })
        
        basketData.combos.forEach((e) => {
            e.products.map((prod)=>{
                return dataCB.push({
                    ...prod
                }) 
            })
        })
        dispatch(basketActions.checkStockBasket(basketId));
        dispatch(basketActions.checkStock({
            params: {
                id: basketId
            },
            onCompleted: (res) =>{
                const data = res.data.items;
                dataCB.some((product)=>{
                    
                    if(!data.some((e) => e.sku === product.sku)){
                        err = true;
                        return true;
                    }
                })
                data.some((e) => {
                    
                    if (
                        (dataCB.filter((product) => product.sku === e.sku).reduce((prev, current) => prev + current.quantity, 0) > e.quantity)
                        
                    ) {
                        err1 = true
                        return true;
                    }
                });
                
                if(err || err1){
                    setShow(true);
                } else{
                    setDisabledBtn(true);
                    removeItem(storageKeys.PURCHASED);
                    beginCheckoutFunc(basketData);
                    addShippingInfoFunc(basketData, checkedDeliveryMethod);
                    addPaymentInfoFunc(basketData, checkedPaymentMethod)
                    dispatch(orderActions.createOrder({
                        params,
                        onCompleted: onCompletedOrder,
                        onError: onErrorOrder
                    }));
                }
            },
            onError: (err) =>{
                console.log(err)
            }
        }))
        
        
    }

    const onChangeDeliveryMethod = (value: any) => {
        setCheckedDeliverMethod(value)
        handleApiDelivery(null, value);        
    }

    const renderFormAuth = () => {
        return (
            add ? (
                renderFormAddAddress()
            ) : (
                <div className={styles.addressGroup}>
                    <div className={styles.group}>
                        <RadioBoxField
                            items={radioAddressData()}
                            name="address"
                            onUpdate={onUpdateAddress}
                            propsValue={checkedOptionAddress}
                            classNameItem={styles.item}
                            className={styles.itemGroup}
                        />
                    </div>
                    <div className={styles.addAddress} onClick={() => setAdd(true)}>
                        <IconAdd />
                        Thêm địa chỉ
                    </div>
                </div>
            )
        )
    }

    const renderFormUnAuth = () => {
        return (
            <>
                <InputTextField
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    name="firstName"
                    required
                />
                <InputTextField
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    name="phone"
                    required
                />
                <InputTextField
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    name="address"
                    required
                />
                <div className={styles.groupSelect}>
                    <Select
                        className={styles.select}
                        value={selectedProvinceOption}
                        placeholder="Tỉnh/ Thành phố"
                        onChange={onChangeProvince}
                        options={provinceOptions}
                        name={"city"}
                        components={{ IndicatorSeparator: () => null }}
                        styles={styleSelect}
                    />
                    <Select
                        className={styles.select}
                        value={selectedDistrictOption}
                        placeholder="Quận"
                        onChange={onChangeDistrict}
                        options={districtOptions}
                        name={"district"}
                        components={{ IndicatorSeparator: () => null }}
                        styles={styleSelect}
                    />
                    <Select
                        className={styles.select}
                        value={selectedWardOption}
                        placeholder="Phường/ Xã"
                        onChange={onChangeWard}
                        options={wardOptions}
                        name={"ward"}
                        components={{ IndicatorSeparator: () => null }}
                        styles={styleSelect}
                    />
                </div>
            </>
        )

    };

    const renderFormAddAddress = () => {
        return (
            <>
                {renderFormUnAuth()}
                <CheckboxField
                    name="saveAddress"
                    className={styles.selectAddress}
                    defaultChecked={true}
                >
                    <p className={styles.content}>Lưu vào sổ địa chỉ</p>
                </CheckboxField>
                <Button className={styles.cancel} onClick={() => setAdd(false)}>
                    Hủy bỏ
                </Button>
            </>
        )
    }

    return (
        <InfoForm isAuth={isAuthenticated} name={user?.fullName}>
            <div className={classNames({
                [styles.authForm]: true,
                [styles.unAuthForm]: true,
            })}>
                <BasicForm
                    initialValues={initValueForm}
                    validationSchema={Yup.object(validateForm())}
                    onSubmit={onSubmitForm}
                >

                    {isAuthenticated ? renderFormAuth() : renderFormUnAuth()}
                    <div style={{ color: 'red', marginTop: '10px' }}>{errorAddress}</div>

                    <InputTextField
                        textarea={true}
                        label="Ghi chú"
                        placeholder="Ghi chú đơn hàng"
                        name="note"
                        rows={3}
                    />
                    <p className={styles.paymentMethod}>Phương thức Vận chuyển</p>
                    <div className={styles.radioBox}>
                        <RadioBoxField
                            items={deliveryData}
                            name="deliveryMethod"
                            propsValue={checkedDeliveryMethod}
                            classNameItem={styles.radioItem}
                            onUpdate={onChangeDeliveryMethod}
                        />
                    </div>

                    <p className={styles.paymentMethod}>Phương thức thanh toán</p>
                    <div className={styles.radioBox}>
                        <RadioBoxField
                            items={paymentMethodData()}
                            name="paymentMethod"
                            onUpdate={onUpdatePayment}
                            propsValue={checkedPaymentMethod}
                            classNameItem={styles.radioItem}
                        />
                    </div>
                    <div className={styles.btnGroup}>
                        <Button className={styles.btn} buttonStyle="secondary" type="submit" disabled={deliveryFeeErr || disabledBtn}>
                            Đặt hàng
                        </Button>
                    </div>

                </BasicForm>
            </div>
            <BaseModal
                isOpen={show}
                onClose={() => {setShow(false); router.push(paths.cart)}}
                bodyClass={styles.modalBody}
                confirmButtonLabel="Quay lại giỏ hàng"
                onConfirm={() => {setShow(false); router.push(paths.cart)}}                
                headerClass={styles.modalHeader}
                footerClass={styles.modalFooter}
            >
                <div className={styles.modalTitle}> 
                    <p>Giỏ hàng của bạn đang có sản phẩm hết hàng hoặc lớn hơn số lượng tồn kho.</p>
                    <p>Vui lòng loại bỏ các sản phẩm hết hàng hoặc giảm số lượng để đặt hàng.</p>
                </div>
            </BaseModal>
            <BaseModal 
            isOpen={isDeliveryFeeErr}
            onClose={() => {setIsDeliveryFeeErr(false)}}
            bodyClass={styles.modalBody}
            confirmButtonLabel="Đã hiểu"
            onConfirm={() => {setIsDeliveryFeeErr(false)}}                
            headerClass={styles.modalHeader}
            footerClass={styles.modalFooter}>
                <div className={styles.modalTitle}> 
                        <p style={{color: 'red', fontSize: 20}}>Đã xảy ra lỗi</p>
                        <p style={{color: 'red', fontSize: 20}}>Vui lòng chọn đơn vị vận chuyển khác.</p>
                </div>
            </BaseModal>
        </InfoForm>
    );
};

export default React.memo(UnAuthForm);
