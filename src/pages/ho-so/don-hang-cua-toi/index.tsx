import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { orderActions, orderActionTypes } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";

import ProfileLayout from "@@Profile/ProfileLayout";
import MyOrder from "@@Profile/Order";
import { paths } from "@constants";
import useAuth from "@hooks/useAuth";
import NotAccess401 from "@hocs/NotAccess401";
import Loading from "@@@Loading";
import { useRouter } from "next/router";

const Index = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { key } = router.query;
    const dispatch = useDispatch();
    const { [orderActionTypes.GET_LIST_ORDER]: loading }: any = useSelectorTyped(
        (state) => state.loading
    );
    useEffect(() => {
        if (key) {
            dispatch(orderActions.getOrders({ code: key }));
        } else {
            dispatch(orderActions.getOrders({}));
        }
    }, [key, dispatch]);

    const breadcrumbsData = [
        {
            label: "Trang chủ",
            url: paths.home,
            active: false,
        },
        {
            label: "Hồ sơ",
            url: paths.profile.index,
            active: false,
        },
        {
            label: "Đơn hàng của tôi",
            active: true,
        },
    ];

    return (
        <NotAccess401 condition={isAuthenticated}>
            <ProfileLayout breadcrumbsData={breadcrumbsData}>
                <MyOrder /> 
                <Loading active={loading} />
            </ProfileLayout>
        </NotAccess401>
    );
};

export default Index;
