import React, { useState } from "react";
import classNames from "classnames";
import { Collapse } from 'react-collapse';

import IconArrow from '@assets/icons/arrow.svg';
import IconArrowLine from '@assets/icons/arrow-line.svg';
import styles from "./FilterCollapse.module.scss";
import { useRouter } from "next/router";

type FilterCollapsePropTypes = {
    label?: string,
    className?: string,
    classNameBody?: string,
    isAction?: boolean,
    isSpecial?: boolean,
    data?: any,
    children?: any,
    name: string,
    onSelected: (value: any, name: any)=>  void,
    resultData?: any;
}

const FilterCollapse = React.memo(({
    label,
    className,
    classNameBody,
    isAction = false,
    data,
    name,
    onSelected,
    isSpecial,
    children,
    resultData
}: FilterCollapsePropTypes) => {
    const route = useRouter();
    const {query} = route;
    const args = {
        containerHeight: 123
    }
    const [isActive, setIsActive] = useState(false);
    return (
        <div className={classNames(className, styles.filterCollapse, { [styles.active]: isActive })}>
            <div className={styles.head} onClick={() => setIsActive(!isActive)}>
                <label>{label}</label>
                <IconArrow />
            </div>
            <Collapse
                isOpened={isActive}
                onRest={() => args}
            >
                <div className={styles.body}>
                    {isSpecial ? (
                        <>{children}</>
                    ) : (
                        <ul>
                            {data?.map((value: any, key: number) => (
                                <li key={value.id} >
                                    <label>
                                        <input type="checkbox" name={name} onClick = {() => onSelected(value, name)} checked={!!resultData?.find((e:any) => e.filterValue === value.filterValue)}/>
                                        <p>
                                            {name === 'color' && value?.filterValue.includes('#') && <figure style={{ background: value?.filterValue }} />}
                                            <span />{value?.displayName}
                                        </p>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {isAction &&
                    <div className={styles.action}>
                        <button type="button" onClick={() => setIsActive(!isActive)}>
                            <span>Thu gọn</span>
                            <IconArrowLine />
                        </button>
                    </div>
                }
            </Collapse>
        </div >
    );
})
FilterCollapse.displayName = 'FilterCollapse';
export default FilterCollapse;