import React, { useEffect } from "react";
import Store from "@@Store";
import { useDispatch } from "react-redux";
import { storeActions } from "@redux/actions";
import { useRouter } from "next/router";

const StorePage = () => {
    const {query} = useRouter();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(storeActions.getStores({
            ...query,
            page:1,
            page_size:1000
        }));
        dispatch(storeActions.getProvinces({has_store_only:true}));
    },[query]);

    return <Store />;
};

export default StorePage;
