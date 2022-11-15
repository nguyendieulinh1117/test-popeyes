import React, { useState } from "react";
import classNames from "classnames";
import Select from 'react-select';

import IconFilter from "@assets/icons/filter.svg";
import IconArrow from "@assets/icons/arrow-bold.svg";
import styles from "./FilterMobile.module.scss";
import { paths } from "@constants";
import { useRouter } from "next/router";


type FilterMobilePropTypes = {
    setIsFilterMobile?: any,
}

const options = [
    { value: 'default', label: 'Mặc định' },
    { value: 'created_time:asc', label: 'Hàng mới nhất' },
    { value: 'created_time:desc', label: 'Hàng cũ nhất' },
    { value: 'price:desc', label: 'Giá giảm dần' },
    { value: 'price:asc', label: 'Giá tăng dần' },
];

const FilterMobile = ({ setIsFilterMobile }: FilterMobilePropTypes) => {
    const route = useRouter();
    const [selectedSort, setSelectedSort] = useState<any>(options[0]);
    const [isSizeActive, setIsSizeActive] = useState<number>(NaN);
    const [isColor, setIsColor] = useState<boolean>(false);
    const [isSize, setIsSize] = useState<boolean>(false);
    const { query, push } = route;

    const onShowDropDown = (type: string) => {
        if (type === 'color') {
            setIsColor(!isColor);
            setIsSize(false);
        }
        if (type === 'size') {
            setIsSize(!isSize);
            setIsColor(false);
        }
        document.body.style.overflow = isColor || isSize ? 'auto' : 'hidden';
        document.body.style.touchAction = isColor || isSize ? 'auto' : 'none';
    }

    const onShowFilter = () => {
        setIsFilterMobile(true)
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }

    const setSort = (selectedSort: any) => {
      let { slug, sort, sort_type, ...baseQuery} = query;
      let pathname = slug ? `/${slug}`: '';
      let pushQuery: any = {}

      if(selectedSort !== 'default'){
        let sort_query = selectedSort.split(':')[0];
        let sort_type_query = selectedSort.split(':')[1];

        pushQuery = {
          sort: sort_query,
          sort_type: sort_type_query
        }
      }

      push({
        // pathname,
        query : {
            ...baseQuery,
            ...pushQuery
        }
      })
    }
    return (
        <div className={styles.filterMobile}>
            <div className={styles.box}>
                <div className={styles.sort}>
                    <Select
                        defaultValue={selectedSort}
                        value={options.find(options => options.value === selectedSort)}
                        onChange={(e) => setSort(e.value)}
                        options={options}
                        className={styles.selectSort}
                        classNamePrefix={"prefix"}
                        name={"sort"}
                        isSearchable={false}
                    />
                </div >
                {/* <div className={classNames(styles.color, { [styles.active]: isColor })}>
                    <button
                        type="button"
                        className={styles.head}
                        onClick={() => onShowDropDown('color')}
                    >
                        <span>Màu sắc</span>
                        <IconArrow />
                    </button>
                    {isColor &&
                        <ul className={styles.body}>
                            {colorData?.map((value: any, key: number) => (
                                <li key={value?.id} className={classNames({ [styles.colorActive]: true })} style={{ borderColor: value?.color }}>
                                    <span style={{ background: value?.color }}></span>
                                    <h3>{value?.name}</h3>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                <div className={classNames(styles.size, { [styles.active]: isSize })}>
                    <button
                        type="button"
                        className={styles.head}
                        onClick={() => onShowDropDown('size')}
                    >
                        <span>Kích thước</span>
                        <IconArrow />
                    </button>
                    {isSize &&
                        <ul className={styles.body}>
                            {sizeData?.map((value: any, key: number) => (
                                <li key={value?.id} className={classNames({ [styles.active]: isSizeActive === value?.id })} >
                                    <div>
                                        {isSizeActive === value?.id && <span onClick={() => setIsSizeActive(NaN)} />}
                                        <button type="button" onClick={() => setIsSizeActive(value?.id)}>
                                            <h3>{value?.name}</h3>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div> */}
                <div className={styles.filter}>
                    <button
                        type="button"
                        className={styles.head}
                        onClick={() => onShowFilter()}
                    >
                        <span>Bộ lọc</span>
                        <IconFilter />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterMobile;