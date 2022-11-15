import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { orderActions, orderActionTypes } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { paths } from "@constants";

import Loading from "@@@Loading";
import ProfileLayout from "@@Profile/ProfileLayout";
import DetailOrder from "@@Profile/Order/DetailOrder";
import EmptyOrder from "@@Profile/Order/EmptyOrder";
import NotFound from "@@NotFound";
import NotAccess401 from "@hocs/NotAccess401";
import useAuth from "@hooks/useAuth";

const Index = () => {
    const route = useRouter();
    const { isAuthenticated } = useAuth();
    const { code } = route.query;
    const dispatch = useDispatch();
    const [found, setFound] = useState<boolean>(false);
    const { [orderActionTypes.GET_ORDER_BY_CODE]: loading }: any = useSelectorTyped(
        (state) => state.loading
    );

    const [orderDetail, setOrderDetail] = useState<any>();
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
            url: paths.profile.order.index,
            active: false,
        },
        {
            label: code,
            active: true,
        },
    ];

    useEffect(() => {
        dispatch(
            orderActions.getOrderByCode({
                params: { id: code },
                onCompleted: (res: any) => {
                    if (res.success) {
                        setFound(true);
                        setOrderDetail(res.data);
                    }
                },
                onError: () => {
                    // toast.error("Đơn hàng không tồn tại");
                    setFound(false);
                },
            })
        );
    }, []);

    return (
        <NotAccess401 condition={isAuthenticated}>
            <ProfileLayout breadcrumbsData={breadcrumbsData}>
                {!loading ? (
                    found ? (
                        <DetailOrder orderDetail={orderDetail} />
                    ) : (
                        <EmptyOrder message="Đơn hàng không tồn tại" />
                    )
                ) : (
                    <Loading active={loading} />
                )}
            </ProfileLayout>
        </NotAccess401>
    );
};

export default Index;
