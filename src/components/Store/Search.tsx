import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Select, { CSSObjectWithLabel } from "react-select";
import styles from "./Search.module.scss";

const styleSelect = {
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#8A8A8A",
    }),
    dropdownIndicator: (base: CSSObjectWithLabel) => ({
        ...base,
        color: "#292929",
    }),
    valueContainer: (base: CSSObjectWithLabel) => ({
        ...base,
        padding: "10px 12px",
    }),
    control: (base: CSSObjectWithLabel) => ({
        ...base,
        borderRadius: "8px",
    }),
    input: (base: CSSObjectWithLabel) => ({
        ...base,
        margin: 0,
        padding: 0,
    }),
};

const Search: React.FC<any> = ({provinceStores}) => {
    const {query, push, pathname} = useRouter()
    const selectDistrictRef: any = useRef();
    const selectProvinceRef: any = useRef();

    const [provinceSelected, setProvinceSelected] = useState<any>();
    const [districtSelected, setDistrictSelected] = useState<any>();
    const [districtOptions, setDistrictOptions] = useState<Array<any>>([]);

    useEffect(()=>{
        fetchData();
    },[provinceStores, query])

    const fetchData = async () => {
        if(!query?.province_id){
            return;
        }
        const selectDataInQuery = provinceStores?.find((province:any)=> {return province.id.toString() === query.province_id});
        setProvinceSelected(selectDataInQuery)
        const districts = selectDataInQuery?.districts?.map((item:any)=>{
            return {
                value: item.id.toString(),
                label: item.name,
            }
        });
        setDistrictOptions(districts || []);
        
        const selectDistrict = districts?.find((district:any)=> {return district.value.toString() === query?.district_id});
        setDistrictSelected(selectDistrict);
    }

    const onSelectItemProvince = (item: any)=>{
        selectDistrictRef?.current?.setValue(undefined)
        if(item?.value){
            push( {
                pathname: `${pathname}`,
                query: {province_id: item.value  }
            })
        }
    }

    const onSelectItemDistrict = (item: any)=>{
        if(item?.value){
            push( {
                pathname: `${pathname}`,
                query: {...query, district_id: item.value  }
            })
            setDistrictSelected(item)
        }
    }

    const defaultValueSelect = (obj : any) => {
        return obj ? {label: obj?.name ,value: obj?.id}: undefined
    }

    const options = provinceStores?.map((province: any)=>{
        return { 
            value: province.id.toString(), 
            label: province.name, 
        }
    }); 
    
    const seeAll = () => {
        push({pathname: `${pathname}`})
        setProvinceSelected(undefined)
        selectProvinceRef?.current?.setValue(undefined);
        setDistrictSelected(undefined)
        selectDistrictRef?.current?.setValue(undefined);
    }

    return (
        <div className={styles.searchBar}>
            <div className={styles.main}>
                <div className={styles.title}>
                    <h4>Tìm kiếm</h4>
                    {query.province_id?<span onClick={seeAll}>Xem tất cả</span>: undefined}
                </div>
                <div className={styles.groupSelect}>
                    <Select
                        ref={selectProvinceRef}
                        className={styles.select}
                        value={defaultValueSelect(provinceSelected)}
                        placeholder="Tỉnh/ Thành phố"
                        onChange={onSelectItemProvince}
                        options={options}
                        name={"city"}
                        components={{ IndicatorSeparator: () => null }}
                        styles={styleSelect}
                    />
                    <Select
                        ref={selectDistrictRef}
                        className = {styles.select}
                        value = {districtSelected}
                        controlShouldRenderValue
                        placeholder = "Quận"
                        onChange = {onSelectItemDistrict}
                        options = {districtOptions}
                        name = {"district"}
                        components = {{ IndicatorSeparator: () => null }}
                        styles = {styleSelect}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
