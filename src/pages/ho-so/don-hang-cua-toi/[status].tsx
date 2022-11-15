import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

import useAuth from "@hooks/useAuth";
import { orderActions, orderActionTypes } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";

import { paths } from "@constants";

import ProfileLayout from "@@Profile/ProfileLayout";
import MyOrder from "@@Profile/Order";
import Loading from "@@@Loading";
import NotAccess401 from "@hocs/Notfound404";

const Index = () => {
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();

    const { key, status } = router.query;

    const { [orderActionTypes.GET_LIST_ORDER]: loading }: any = useSelectorTyped(
        (state) => state.loading
    );

    const renderLabelStatus = () => {
        let data;
        if (status === "da-nhan") {
            data = {
                label: "Chờ xác nhận",
                active: true,
            };
        } else if (status === "dang-xu-ly") {
            data = {
                label: "Đang xử lý",
                active: true,
            };
        } else if (status === "da-huy") {
            data = {
                label: "Đã hủy",
                active: true,
            };
        } else if (status === "da-hoan-thanh") {
            data = {
                label: "Hoàn thành",
                active: true,
            };
        } else if (status === "dang-giao") {
            data = {
                label: "Đang giao",
                active: true,
            };
        } else if (status === "da-ket-thuc") {
            data = {
                label: "Đã kết thúc",
                active: true,
            };
        } else {
            data = false;
        }
        return data;
    };

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
        renderLabelStatus(),
    ];

    const renderStatus = () => {
        let data;
        if (status === "da-nhan") {
            data = "Pending";
        } else if (status === "dang-xu-ly") {
            data = "Processing";
        } else if (status === "dang-chuan-bi") {
            data = "Preparing";
        } else if (status === "da-giao") {
            data = "Shipped";
        } else if (status === "da-huy") {
            data = "Cancelled";
        } else if (status === "dang-yeu-cau-huy") {
            data = "RequestCancel";
        } else if (status === "da-hoan-thanh") {
            data = "Completed";
        } else if (status === "dang-hoan") {
            data = "Delayed";
        } else if (status === "dang-giao") {
            data = "Shipping";
        } else if (status === "da-ket-thuc") {
            data = "Closed";
        } else {
            data = false;
        }
        return data;
    };

    useEffect(() => {
        if (status) {
            if (key) {
                dispatch(orderActions.getOrders({ code: key }));
            } else {
                // dispatch(orderActions.getOrders({}));
            }
        }
    }, [key, status]);

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
