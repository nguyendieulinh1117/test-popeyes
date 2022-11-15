import React, { useEffect, useState } from "react";
import { useField } from "formik";
import classNames from "classnames";

import styles from "./RadioBoxField.module.scss";

type RadioBoxPropTypes = {
    name?: any;
    items?: any;
    propsValue?: any;
    onUpdate?: (value: any) => void;
    className?: any;
    classNameItem?: any;
};

const RadioBoxField = ({
    name,
    items,
    propsValue,
    onUpdate,
    className,
    classNameItem,
}: RadioBoxPropTypes) => {
    
    const [field, meta] = useField({ name });
    const [valueRadio, setValueRadio] = useState<any>({ value: propsValue });
    const onChange = (e: any) => {
        const value = e.target.value;
        setValueRadio({value});
        if(typeof onUpdate === 'function'){
            onUpdate(value)
        }
    };

    useEffect(()=>{
        setValueRadio({ value: propsValue })
    },[propsValue])
   
    return (
        <div className={classNames(className, { [styles.radioBoxField]: true })}>
            {items?.map((item: any, key: number) => (
                <div key={key} className={classNames(styles.radioBoxItem, classNameItem)}>
                    <input
                        {...field}
                        type="radio"
                        checked={valueRadio.value === item.value}
                        disabled={item.disabled}
                        value={item.value}
                        name={name}
                        onChange={onChange}
                        id={`${name}-${item.value}`}
                    />
                    <label htmlFor={`${name}-${item.value}`}>
                        {item?.icon && <img src={item?.icon} alt={item.label}/>}
                        <span>{item.label}</span>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default RadioBoxField;
