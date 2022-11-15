import React, { useEffect, useState } from "react";
import Breadcrumbs from "@@@Breadcrumbs";
import styles from "./index.module.scss";
import Container from "@@@Container";
import Map from "./Map";
import SearchBar from "./SearchBar";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { useRouter } from "next/router";

const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: "/",
        active: false,
    },
    {
        label: "Danh sách cửa hàng",
        active: true,
    }
];

const Store = () => {
    const { query } = useRouter();
    const [position, setPosition] = useState<google.maps.LatLng | google.maps.LatLngLiteral>({
        lat: 10.83347485770238,
        lng: 106.66603946782482,
    });
    const { arrStores, arrProvinces }: any = useSelectorTyped((store) => store.store);
    const [marker, setMarker] = useState<any>(null);

    const [activeMarker, setActiveMarker] = useState<number>(0);
    const [isClick, setIsClick] = useState<boolean>(false);

    const dataStore =
        arrStores?.items?.map((item: any) => {
            return {
                ...item,
                position: { lat: item.lat, lng: item.lng },
            };
        }) || [];

    const provinceStores = arrProvinces?.map((province: any) => {
        return {
            ...province,
            stores: dataStore?.filter((store: any) => province.id === store.provinceId),
        };
    });


    const handleClickMarker = (marker: any) => {
        setActiveMarker(0);
        setIsClick(true);
        setPosition(marker.position);
        setMarker(marker);
    };

    const handleActiveMarker = (marker: any) => {
        setActiveMarker(marker.id);
        setIsClick(false);
    };
    const handleHideMarker = () => {
        if (!isClick) {
            setActiveMarker(0);
            setIsClick(false);
        }
    };
    const handleUnClickMarker = () => {
        setActiveMarker(0);
        setIsClick(false);
    };

    useEffect(()=>{
        handleUnClickMarker();
    },[query])

    return (
        <div className={styles.storePage}>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <div className={styles.store}>
                <Container>
                    <h3 className={styles.storeTitle}>TÌM CỬA HÀNG</h3>
                    <div className={styles.storeMain}>
                        <Map
                            markers={dataStore || []}
                            position={position}
                            marker={marker}
                            activeMarker={activeMarker}
                            isClick={isClick}
                            handleClickMarker={handleClickMarker}
                            handleActiveMarker={handleActiveMarker}
                            handleHideMarker={handleHideMarker}
                            handleUnClickMarker={handleUnClickMarker}
                        />
                        <SearchBar
                            provinceStores={provinceStores}
                            handleClickMarker={handleClickMarker}
                        />
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default React.memo(Store);
