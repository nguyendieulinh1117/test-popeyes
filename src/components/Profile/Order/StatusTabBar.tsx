import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import style from "./StatusTabBar.module.scss";

import classNames from "classnames";
import { paths } from "@constants";
import { Desktop } from "@components/Common/Media";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { useDispatch } from "react-redux";
import { orderActions } from "@redux/actions";

import IconArrowRight from "@assets/icons/arrow-right.svg";

interface StatusTabBarProps {
    statusActive?: any;
    query?: string | string[];
}

const StatusTabBar = (Props: StatusTabBarProps) => {
    const { statusActive, query } = Props;
    const dispatch = useDispatch();
    const refStatusBar = useRef<any>(null);
    const { dataAllOrder } = useSelectorTyped((state) => state.order);
    const [hide, setHide] = useState<boolean>(false);
    const [scrollNumber, setScrollNumber] = useState<number>(0)

    const listOderData = dataAllOrder?.items;
    const listOrderPending = listOderData?.filter((e: any) => e.status === "Pending" || e.status === "PaymentFailed");
    const listOrderProcessing = listOderData?.filter((e: any) => e.status === "Processing" || e.status === "Preparing");
    
    const listOrderCancelled = listOderData?.filter((e: any) => e.status === "Cancelled" || e.status === "RequestCancel");
    
    const listOrderShipping = listOderData?.filter((e: any) => e.status === "Shipping");
    const listOrderCompleted = listOderData?.filter((e: any) => e.status === "Completed" || e.status === "Shipped");
    const listOrderClosed = listOderData?.filter((e: any) => e.status === "Closed");
    useEffect(() => {
        dispatch(orderActions.getAllOrders({}));
    }, []);

    const listStatus = [
        {   key: 0,
            title: "Tất cả",
            status: "all",
            count: listOderData?.length,
            url: query ? `${paths.profile.order.index}?key=${query}` : paths.profile.order.index,
        },
        {   key: 1,
            title: "Chờ xác nhận",
            status: "da-nhan",
            count: listOrderPending?.length,
            url: query
                ? `${paths.profile.order.pending}?key=${query}`
                : paths.profile.order.pending,
        },
        {
            key: 2,
            title: "Đang xử lý",
            status: "dang-xu-ly",
            count: listOrderProcessing?.length,
            url: query
                ? `${paths.profile.order.process}?key=${query}`
                : paths.profile.order.process,
        },
        {
            key: 3,
            title: "Đang giao",
            status: "dang-giao",
            count: listOrderShipping?.length,
            url: query
                ? `${paths.profile.order.shipping}?key=${query}`
                : paths.profile.order.shipping,
        },
        {
            key: 4,
            title: "Hoàn thành",
            status: "da-hoan-thanh",
            count: listOrderCompleted?.length,
            url: query
                ? `${paths.profile.order.complete}?key=${query}`
                : paths.profile.order.complete,
        },
        {
            key: 5,
            title: "Đã huỷ",
            status: "da-huy",
            count: listOrderCancelled?.length,
            url: query ? `${paths.profile.order.cancel}?key=${query}` : paths.profile.order.cancel,
        },
        {
            key: 6,
            title: "Đã kết thúc",
            status: "da-ket-thuc",
            count: listOrderClosed?.length,
            url: query ? `${paths.profile.order.closed}?key=${query}` : paths.profile.order.closed,
        },
    ];

    useEffect(()=>{
        if(statusActive){
            let scroll = 165 * (listStatus?.find((e)=>e.status === statusActive)?.key||0); 
            refStatusBar.current.scrollLeft = scroll
            
            

            if(scroll >= 165 * (listStatus.length - 1)){
                setHide(true)
            } else{
                setHide(false)
            }
        }
    }, [statusActive, refStatusBar])
   
    const handleEndScroll = (e)=>{
          if(refStatusBar.current.scrollWidth - refStatusBar.current.scrollLeft === refStatusBar.current.clientWidth){
            setHide(true)
          } else{
              setHide(false)
          }
      };


    return (
        <div className={style.statusBar}>
            <div className={style.tabBar} ref={refStatusBar} onScroll={handleEndScroll} >
                {listStatus.map((item, index) => (
                    <Link key={index} href={item.url} passHref>
                        <div
                            className={classNames(style.statusItem, {
                                [style.active]: statusActive === item.status,
                            })}
                        >
                            {item.title}{" "}
                            {item.count > 0 ? <Desktop>{`(${item.count})`}</Desktop> : ""}
                        </div>
                    </Link>
                ))}
            </div>
            {!hide && <IconArrowRight />}
        </div>
    );
};

export default StatusTabBar;
