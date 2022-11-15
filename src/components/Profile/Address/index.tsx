import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDispatch } from "react-redux";

import Button from '@components/Common/Form/Button';
import AddressItem from './AddressItem'
import { paths } from '@constants';
import { Mobile } from '@components/Common/Media';
import { useSelectorTyped } from "@hooks/useSelectorType";
import { addressActions } from "@redux/actions";

import IconLeft from "@assets/icons/arrow-left.svg";
import style from './index.module.scss';

const Address = () => {
    const dispatch = useDispatch();
    const { addressBooks } = useSelectorTyped((state) => state.address);
    useEffect(() => {
        dispatch(addressActions.getAddress());
    }, []);

    return (
        <div className={style.address}>
            <div className={style.center}>
                <div className={style.titleForm}>
                    SỔ ĐỊA CHỈ
                    <Mobile>
                        <Link href={paths.profile.index} passHref>
                            <div className={style.returnBtn}>
                                <IconLeft />
                            </div>
                        </Link>
                    </Mobile>
                </div>
                {addressBooks?.length > 0 ?
                    <div className={style.haveAddress}>
                        <div className={style.listAddress}>
                            {addressBooks.map((value: any, key: number) => (
                                <AddressItem key={key} data={value} />
                            ))}
                        </div>
                        <div className={style.createAddress}>
                            <span>Bạn muốn giao đến địa chỉ khác?</span>
                            <Link href={paths.profile.createAddress} passHref>
                                <span className={style.btnAdd}>+ Thêm địa chỉ mới</span>
                            </Link>
                        </div>
                    </div>
                    :
                    <div className={style.noAddress}>
                        <span>Bạn muốn giao đến địa chỉ khác?</span>
                        <Link href={paths.profile.createAddress} passHref>
                            <Button buttonStyle="secondary" className={style.btnSubmit}>Thêm địa chỉ mới</Button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
}

export default Address;