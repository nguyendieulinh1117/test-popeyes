import React from "react";
import BasicForm from "@components/Common/Form/BasicForm";
import Button from "@components/Common/Form/Button";
import InputTextField from "@components/Common/Form/InputTextField";
import IconSearch from "@assets/icons/search.svg";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

import { storageKeys } from "@constants";
import styles from "./FormSearch.module.scss";
import { setObjectData } from "@utils/sessionStorage";

const FormSearch = () => {
    const {
        ready,
        value,
        setValue,
        suggestions: { data, status },
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleInput = (value) => {
        setValue(value);
    };
    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleSelect =
        ({ description }) =>
        () => {
            setValue(description, false);
            clearSuggestions();

            getGeocode({ address: description }).then((results) => {
                // console.log(results);
                const { lat, lng } = getLatLng(results[0]);
                setObjectData(storageKeys.POSITION, {
                    address: results[0].formatted_address,
                    lat: lat,
                    lng: lng,
                });
            });
        };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    const onSubmitSearch = (value: any) => {
        handleInput(value.address);
    };
    return (
        <div className={styles.wrapSearch} ref={ref}>
            <BasicForm
                enableReinitialize={true}
                className={styles.formSearch}
                initialValues={{ address: value }}
                onSubmit={onSubmitSearch}
            >
                <InputTextField
                    className={styles.inputField}
                    placeholder="Nhập địa chỉ của bạn"
                    name="address"
                    disabled={!ready}
                />
                <Button type="submit" buttonStyle={"secondary"}>
                    <IconSearch />
                </Button>
            </BasicForm>
            {status === "OK" && <ul className={styles.listAddress}>{renderSuggestions()}</ul>}
        </div>
    );
};

export default FormSearch;
