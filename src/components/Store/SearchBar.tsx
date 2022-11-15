import React from "react";

import ListStore from "./ListStore";
import Search from "./Search";

import styles from "./SearchBar.module.scss";

const SearchBar: React.FC<any> = ({
    provinceStores,
    handleClickMarker,
}) => {
    return (
        <div className={styles.search}>
            <Search provinceStores={provinceStores} />
            <ListStore provinceStores={provinceStores} handleClickMarker={handleClickMarker} />
        </div>
    );
};

export default SearchBar;
