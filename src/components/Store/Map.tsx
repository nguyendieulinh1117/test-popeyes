import React from "react";

import { GoogleMap, InfoWindow, Marker, useLoadScript } from "@react-google-maps/api";
import InfoStore from "./InfoStore";
import styles from "./Map.module.scss";
import FormSearch from "./FormSearch";

export type MarkerType = {
    id: number;
    name: string;
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    address: string;
    phoneNumber: string;
    openTime: string;
    closeTime: string;
    lat: string;
    lng: string;
};
type MapType = {
    markers: MarkerType[];
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    marker: any;
    activeMarker: number;
    isClick: boolean;
    handleClickMarker: any;
    handleActiveMarker: any;
    handleHideMarker: any;
    handleUnClickMarker: any;
};
const Map = ({
    markers,
    position,
    marker,
    activeMarker,
    isClick,
    handleClickMarker,
    handleActiveMarker,
    handleHideMarker,
    handleUnClickMarker,
}: MapType) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyD4S-7VnutQrvqzKjycYf4dmgxViUG9CGM",
        libraries: ["places"],
    });

    const handleOnLoad = (map: any) => {
        const bounds = new google.maps.LatLngBounds();
        if (isClick) {
            bounds.extend(position);
            map.fitBounds(bounds);
        } else {
            markers.forEach(({ position }) => bounds.extend(position));
            map.fitBounds(bounds);
        }
    };

    return (
        <div className={styles.map}>
            {isLoaded ? (
                <>
                    <FormSearch />
                    <GoogleMap
                        zoom={isClick ? 16 : 7}
                        center={position}
                        onClick={handleUnClickMarker}
                        mapContainerClassName={styles.container}
                    >
                        {isClick ? (
                            <Marker position={position} icon={"/icons/marker-pin.png"}>
                                {activeMarker === 0 && (
                                    <InfoWindow
                                        options={{
                                            minWidth: 300,
                                            maxWidth: 300,
                                            pixelOffset: new google.maps.Size(0, -70),
                                        }}
                                        position={position}
                                        onCloseClick={handleUnClickMarker}
                                    >
                                        <InfoStore info={marker} />
                                    </InfoWindow>
                                )}
                            </Marker>
                        ) : (
                            <>
                                {markers.map((item: any, index: number) => (
                                    <Marker
                                        key={`marker_${index}`}
                                        position={item.position}
                                        onMouseOver={() => handleActiveMarker(item)}
                                        onMouseOut={handleHideMarker}
                                        onClick={() => handleClickMarker(item)}
                                        icon={"/icons/marker-pin.png"}
                                    >
                                        {activeMarker === item?.id ? (
                                            <InfoWindow
                                                options={{
                                                    minWidth: 300,
                                                    maxWidth: 300,
                                                }}
                                                onCloseClick={handleUnClickMarker}
                                            >
                                                <InfoStore info={item} />
                                            </InfoWindow>
                                        ) : null}
                                    </Marker>
                                ))}
                            </>
                        )}
                    </GoogleMap>
                </>
            ) : null}
        </div>
    );
};

export default Map;
