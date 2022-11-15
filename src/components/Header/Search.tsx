import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

import BasicForm from "@@@Form/BasicForm";
import CachedImage from "@@@CachedImage";
import { useOutsideClick } from "@hooks/useOutsideClick";
import { productActions } from '@redux/actions';
import { formatPrice, getProductDetailUrl } from "@utils";

import IconSearch from '@assets/icons/search.svg';
import styles from './Search.module.scss';
import Router from 'next/router';
import { renderDiscount } from '@utils/discount';
import moment from 'moment';

const Search = ({ dropDown = true }: any) => {
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState<string>('');
    const [isShowSearch, setIsShowSearch] = useState<boolean>(false);
    const [listProduct, setListProduct] = useState<any[]>([]);
    const [timeOutSearch, setTimeOutSearch] = useState<any>(0);
    const wrapperRef: any = React.createRef();

    const onClose = () => {
        setIsShowSearch(false);
    };

    const divref: any = useOutsideClick(onClose, true, false);

    const handleSearch = (name: string) => {
        dispatch(productActions.getProducts({
            params: { name },
            onCompleted: (res: any) => {
                if (res.success) {
                    setListProduct(res.data?.items);
                }
            },
            onError: (err: any) => { },
        }));
    };

    const onSubmitSearch = () => {
        setIsShowSearch(false);
        handleSearch(searchValue)
        Router.push(`/tim-kiem?keyword=${searchValue}`);
    };

    const onChangeSearch = (event: any) => {
        clearTimeout(timeOutSearch);
        setSearchValue(event.target.value);
        if (event.target.value.trim().length > 0 && dropDown) {
            setTimeOutSearch(setTimeout(() => {
                handleSearch(event.target.value);
            }, 500));
        } else {
            setListProduct([]);
        }

    }
    
    const totalDiscount = (item) =>{
        let salePrice = item?.salePrice;
        let discount = item?.discount;
        if (
            item?.promotion &&
            moment()> moment(item?.promotion?.from) &&
            moment() < moment(item?.promotion?.to)
        ) {
            let dis = renderDiscount(
                salePrice,
                item?.promotion?.discount,
                item?.promotion?.maxDiscount,
                item?.promotion?.discountPercentage,
                item?.promotion?.fixedPrice
            );
            
            return (
                
                <p>
                {formatPrice(salePrice - dis || 0)}{" "}
                <del>{formatPrice(salePrice || 0)}</del>
            </p>
            );
        } else {
            if (discount !== 0) {
               
                return (
                    
                    <p>
                    {formatPrice(salePrice - discount  || 0)}{" "}
                    <del>{formatPrice(salePrice || 0)}</del>
                </p>
                );
            } else {
                return (
                    
                     <p>{formatPrice(salePrice || 0)}</p>
                );
            }
        }
    }
    return (
        <div 
        ref={divref}
        className={styles.search}>
            <BasicForm
                initialValues={{ search: "" }}
                onSubmit={onSubmitSearch}
            >
                <input
                    ref={wrapperRef}
                    type="text"
                    // value={searchValue}
                    placeholder='Tìm sản phẩm'
                    onFocus={() => setIsShowSearch(true)}
                    onChange={onChangeSearch}
                    name="search"
                />
                <button type="submit"><IconSearch /></button>
            </BasicForm>
            {isShowSearch && dropDown &&
                <div className={styles.dropDown}>
                    <div className={styles.head}>
                        <IconSearch />
                        <article>
                            {searchValue ? searchValue : 'Tìm sản phẩm'}
                        </article>
                    </div>
                    <div className={styles.body}>
                        {listProduct?.length <= 0 ? (
                            <div className={styles.searchEmpty}>
                                <p>Không có kết quả tìm kiếm</p>
                            </div>
                        ) : (
                            <ul>
                                {listProduct?.map((item: any, key: number) => (
                                    <Link key={key}  href={getProductDetailUrl(item?.slug)} passHref>
                                        <li onClick={() => onClose()} className={classNames(styles.itemProduct, { [styles.itemCategories]: item?.type === 'categories' })} >
                                            <div className={styles.photo}>
                                                <CachedImage src={item?.images[0]?.imageUrl} alt={item?.name} />
                                            </div>
                                            <div className={styles.text}>
                                                {item?.type === 'categories' && <h4>Danh mục</h4>}
                                                <h3>{item?.name}</h3>
                                                {totalDiscount(item)}
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default Search;
