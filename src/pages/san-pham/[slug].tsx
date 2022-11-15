import React from "react";

import ProductDetail from "@@ProductDetail";
import { wrapper } from "@redux/store";
import { productActions, storeActions } from "@redux/actions";

const ProductPage = () => {
    return (
        <ProductDetail />
    );
};

ProductPage.getInitialProps = wrapper.getInitialPageProps(store => ({query}) => {
    store.dispatch(productActions.getProductDetailBySlugLoading({ slug: query.slug }));
    store.dispatch(storeActions.getStores({ page: 1, page_size: 1000}));
    store.dispatch(storeActions.getProvinces({ has_store_only: true}));
});

export default ProductPage;
