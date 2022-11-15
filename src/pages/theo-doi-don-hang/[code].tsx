import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { orderActions, orderActionTypes } from "@redux/actions";
import { paths } from "@constants";
import { useSelectorTyped } from "@hooks/useSelectorType";

import Loading from "@@@Loading";
import Breadcrumbs from "@@@Breadcrumbs";
import EmptyOrder from "@@Profile/Order/EmptyOrder";
import DetailOrder from "@@Profile/Order/DetailOrder";
import Container from "@@@Container";
import TrackingOrder from "@components/TrackingOrder";

const Index = () => {
    const route = useRouter();
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
            label: "Theo dõi đơn hàng",
            url: paths.home,
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
        <>
            <Breadcrumbs breadcrumbs={breadcrumbsData} />
            <TrackingOrder>
                {!loading ? (
                    found ? (
                    <div className="container">
                        <DetailOrder orderDetail={orderDetail} tracking={true} />
                    </div>
                            
                        
                    ) : (
                        <EmptyOrder message="Đơn hàng không tồn tại" />
                    )
                ) : (
                    <Loading active={loading} />
                )}
            </TrackingOrder>
            
        </>
    );
};

export default Index;
