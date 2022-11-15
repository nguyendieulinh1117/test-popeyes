import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelectorTyped } from "@hooks/useSelectorType";

//component
import OrderItem from "./OrderItem";
import EmptyOrder from "./EmptyOrder";

import style from "./ListOrder.module.scss";
import { paths } from "@constants";
import Pagination from "@components/Common/Pagination";
import { orderActions } from "@redux/actions";
import { useDispatch } from "react-redux";
import * as Scroll from "react-scroll";

const ListOrder = ({ query }: any) => {
    const route = useRouter();
    const { status, page } = route.query;

    const dispatch = useDispatch();

    const [currentParams, setCurrentParams] = useState({
        page: 1,
        page_size: 10,
    });

    const [pageIndex, setPageIndex] = useState<number>(0);

    const { dataOrders } = useSelectorTyped((state) => state.order);

    const listOderData = [...dataOrders];
    const listOrderDataTemp = [...dataOrders];

    useEffect(() => {
        if (page) {
            setCurrentParams({
                ...currentParams,
                page: Number(page),
            });
            setPageIndex((Number(page) - 1) * 10);
        } else {
            setCurrentParams({
                ...currentParams,
                page: 1,
            });
            setPageIndex(0);
        }
    }, [page]);

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
    const renderData = (listData: any) => {
        let data;
        if (status === "da-nhan") {
            data = listData?.filter(
                (e: any) => e.status === "Pending" || e.status === "PaymentFailed"
            );
        } else if (status === "dang-xu-ly") {
            data = listData?.filter(
                (e: any) => e.status === "Processing" || e.status === "Preparing"
            );
        } else if (status === "da-huy") {
            data = listData?.filter(
                (e: any) => e.status === "Cancelled" || e.status === "RequestCancel"
            );
        } else if (status === "da-hoan-thanh") {
            data = listData?.filter((e: any) => e.status === "Completed" || e.status === "Shipped");
        } else if (status === "dang-giao") {
            data = listData?.filter((e: any) => e.status === "Shipping");
        } else if (status === "da-ket-thuc") {
            data = listData?.filter((e: any) => e.status === "Closed");
        } else {
            data = listData;
        }
        return data;
    };

    const renderPagination = (listData: any) => {
        let data = renderData(listData)?.splice(
            (currentParams.page - 1) * currentParams.page_size,
            currentParams.page_size
        );
        return data;
    };

    const changePage = (page: number) => {
        setCurrentParams({
            ...currentParams,
            page,
        });
        if (page > 1) {
            route.push(`${route.pathname}?page=${page}`);
        } else {
            route.push(`${route.pathname}`);
        }

        const scroll = Scroll.animateScroll;
        scroll.scrollToTop({ smooth: true });
        setPageIndex((page - 1) * 10);
    };

    return (
        <div className={style.listOrder}>
            {renderData(listOderData)?.length > 0 ? (
                renderData(listOderData)
                    .splice(pageIndex, 10)
                    .map((item: any, index: number) => <OrderItem key={index} orderItem={item} />)
            ) : (
                <>
                    {query ? (
                        <EmptyOrder message="Đơn hàng không tồn tại" />
                    ) : (
                        <EmptyOrder message="Bạn chưa có đơn hàng nào." />
                    )}
                </>
            )}

            {renderData(listOrderDataTemp)?.length > 0 && (
                <Pagination
                    totalPage={Math.ceil(renderData(listOrderDataTemp)?.length / 10)}
                    currentpage={currentParams.page}
                    pageParams={currentParams.page}
                    onChange={changePage}
                />
            )}
        </div>
    );
};

export default ListOrder;
