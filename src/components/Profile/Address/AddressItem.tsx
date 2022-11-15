import React, { useState, createRef } from 'react'
import style from './AddressItem.module.scss';
import Link from 'next/link';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';

import { addressActions } from "@redux/actions";
import IconTrash from "@assets/icons/trash.svg";
import { paths } from '@constants';
import BaseModal from '@@@Modal';


type Props = {
    data: any,
}

const AddressItem = (props: Props) => {
    const { data } = props;
    const [isShow, setIsShow] = useState<boolean>(false)
    const dispatch = useDispatch();
    const wrapperRef: any = createRef();

    const onDeleteAddress = () => {
        dispatch(addressActions.deleteAddress({
            params: { id: data.id },
            onCompleted: (res: any) => {
                if (res.success) {
                    dispatch(addressActions.getAddress({}));
                    onCloseModal();
                }
            },
            onError: () => { },
        }))
    }

    const onCloseModal = () => {
        setIsShow(false);
    }
    
    return (
        <div className={style.addressItem} >
            <div className={style.left}>
                <div className={style.name}>
                    {data.name}
                    {data?.isDefault &&
                        <div className={style.isDefault}>Mặc định</div>
                    }
                </div>
                <div className={style.phone}>{data.phone}</div>
                <div className={style.location}>{data.fullAddress}</div>
            </div>
            <div className={style.right}>
                <Link href={`${paths.profile.updateAddress}?id=${data?.id}`} passHref>
                    <button type="button" className={style.editBtn}>Chỉnh sửa</button>
                </Link>
                {!data?.isDefault &&
                    <button
                        type="button"
                        className={style.deleteBtn}
                        onClick={() => setIsShow(true)}
                    >
                        <IconTrash />
                    </button>
                }
            </div>
            <BaseModal
                isOpen={isShow}
                onClose={() => onCloseModal()}
                bodyClass={style.modalBody}
                headerClass={style.modalHeader}
                confirmButtonLabel="Xóa"
                onConfirm={onDeleteAddress}

            >
                <div className={style.modalTitle}>
                    Bạn có chắc muốn xóa địa chỉ này?
                </div>
                <div className={style.modalContent}>
                    <p><span>{data.name}</span>{data.phone}</p>
                    <p>{data.fullAddress}</p>
                </div>
            </BaseModal >
        </div>
    );
}

export default AddressItem;