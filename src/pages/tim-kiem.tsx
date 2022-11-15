import React, { useEffect } from "react";

import ProductSearch from "@@ProductSearch";
import { wrapper } from "@redux/store";
import { productActions } from "@redux/actions";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const SearchPage = () => {
    const dispatch = useDispatch();
    const {query} = useRouter();
    useEffect(()=>{
        dispatch(productActions.searchProducts({name: query?.keyword}));
    }, [query])
    return <ProductSearch />;
};

export default SearchPage;
