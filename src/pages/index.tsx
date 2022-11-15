import { homeActions } from "@redux/actions";
import HomePage from "@@Home";
import { wrapper } from "@redux/store";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { EnumkeyCollections } from "@constants/enum";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Home = () => {
    const dispatch = useDispatch();

    const { collections } = useSelectorTyped((state) => state.home);

    const findCollection = (key: string) => {
        return collections?.find((collection: any) => collection.tag === key);
    };

    const productNewData = findCollection(EnumkeyCollections.NEW);
    const productHotData = findCollection(EnumkeyCollections.BEST_SELLER);
    const productHouseWear = findCollection(EnumkeyCollections.HOUSE_WEAR);

    useEffect(()=>{
        if (productNewData) {
            dispatch(homeActions.getCollectionNew(productNewData.id))
        }

        if (productHotData) {
            dispatch(homeActions.getCollectionBestSeller(productHotData.id))
        }
    }, [collections])
    return (
        <>
            <HomePage productHouseWear={productHouseWear}/>
        </>
    );
};

Home.getInitialProps = wrapper.getInitialPageProps(store => () => {
    store.dispatch(homeActions.getAllCollection({}));
    store.dispatch(homeActions.getListBanner());
    store.dispatch(homeActions.getListBlog({ type: 1 }));
});
export default Home;
