import React from "react";

import ProductSale from "@@ProductSale";
import { wrapper } from "@redux/store";
import { homeActions } from "@redux/actions";

const ProductSalePage = () => {
    return (
        <ProductSale />
    );
};
ProductSalePage.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(homeActions.getAllCollection({}));
});
export default ProductSalePage;
