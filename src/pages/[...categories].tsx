import React from "react";

import ProductFilter from "@@ProductFilter";
import { useRouter } from "next/router";
import Notfound404 from "@hocs/Notfound404";
import { wrapper } from "@redux/store";
import { categoriesActions } from "@redux/actions";

const ProductPage = () => {
    const {query} = useRouter();
    const {categories}:any = query;
    const slugTemp = categories[categories.length  - 1];
    console.log(categories)
    return (
        <Notfound404 condition={!!slugTemp} >
            <ProductFilter slug = {slugTemp}/>
        </Notfound404>
    );
};

ProductPage.getInitialProps = wrapper.getInitialPageProps(store => ({query}) => {
    store.dispatch(categoriesActions.getProductFilter({}));
});

export default ProductPage;
