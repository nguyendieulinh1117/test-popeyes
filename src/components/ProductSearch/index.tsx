import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useRouter } from "next/router";

import Breadcrumbs from "@@@Breadcrumbs";
import ProductItem from "@@@ProductItem";
import Search from '@@Header/Search';
import useDevices from '@hooks/useDevices';
import { productActions } from '@redux/actions';

import IconSearchEmpty from '@assets/icons/search-empty.svg';
import styles from "./index.module.scss";
import useDynamicContent from "@hooks/useDynamicContent";
import { commonKeys } from "@constants";
import { useSelectorTyped } from "@hooks/useSelectorType";

const breadcrumbsData = [
    {
        label: 'Trang chủ',
        url: '/',
        active: false,
    },
    {
        label: 'Tìm kiếm',
        active: true,
    },
];

const ProductSearch = () => {
    const dispatch = useDispatch();
    const { contenValue } = useDynamicContent(commonKeys.COMMON_HEADER_FOOTER_CONTENTS);
    const listProduct = useSelectorTyped(state => state.product.products);
    // const [listProduct, setListProduct] = useState<any[]>([]);
    const { isMobile } = useDevices();
    const { query } = useRouter();
    const keyword = query?.keyword;

    useEffect(() => {
        
    }, [keyword]);

    console.log('listProduct',listProduct);
    
    return (
        <div className={styles.productSearch}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className="container">
                <div className={styles.box}>
                    <div className={styles.title}>
                        <h3>KẾT QUẢ TÌM KIẾM SẢN PHẨM "{query?.keyword}"</h3>
                    </div>
                    {listProduct?.length > 0 ? (
                        <div className={styles.show}>
                            {listProduct?.map((value: any, key: number) => {
                                if (isMobile && key >= 6) { return }
                                return (
                                    <ProductItem key={key} data={value} className={styles.productCol} />
                                )
                            })}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <div className={styles.icon}>
                                <IconSearchEmpty />
                            </div>
                            <div className={styles.content}>
                                <h3>Rất tiếc, không tìm thấy sản phẩm từ “<span>{query?.keyword}</span>”</h3>
                                <p>HÃY THỬ LẠI CÁCH KHÁC NHƯ</p>
                                <ul>
                                    <li>1. Kiểm tra lại từ khóa có thể bạn đã gõ sai.</li>
                                    <li>2. Hãy dùng từ khóa ngắn và đơn giản hơn.</li>
                                    <li>3. Nhập lại từ khoá</li>
                                </ul>
                            </div>
                            <div className={styles.searchBox}>
                                <Search dropDown={false} />
                                <p>Bạn cần giúp đỡ? Vui lòng liên hệ hỗ trợ khách hàng <span>{contenValue?.phoneTakeCare}</span></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default ProductSearch;