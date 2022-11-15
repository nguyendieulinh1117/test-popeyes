import classNames from "classnames";
import React from "react";
import style from "./Timeline.module.scss";

const Timeline = ({ status }: any) => {
    return (
        <div className={style.timeline}>
            <div className={classNames(style.item, { [style.active]: status === "Pending" })}>
                <div className={style.title}>Đặt hàng thành công</div>
                {/* <div className={style.time}>14:45, Monday 26/10/2020</div> */}
            </div>
            <div
                className={classNames(
                    style.item,
                    { [style.deActive]: status === "Pending" },
                    { [style.active]: status === "Processing" }
                )}
            >
                <div className={style.title}>Đang xử lý</div>
            </div>
            {[ "RequestCancel", "Cancelled"].includes(status) ? undefined : <div
                className={classNames(
                    style.item,
                    { [style.deActive]: status === "Pending" || status === "Processing" },
                    { [style.active]: status === "Preparing" }
                )}
            >
                <div className={style.title}>Đang soạn hàng</div>
            </div>}
            {[ "RequestCancel", "Cancelled"].includes(status) ? undefined : <div
                className={classNames(
                    style.item,
                    {
                        [style.deActive]:
                            status === "Pending" ||
                            status === "Processing" ||
                            status === "Preparing",
                    },
                    { [style.active]: status === "Shipping" }
                )}
            >
                <div className={style.title}>Đang giao hàng</div>
            </div>}
            {![ "RequestCancel", "Cancelled"].includes(status) ? <div
                className={classNames(
                    style.item,
                    {
                        [style.deActive]:
                            [
                                "Pending", "Processing", 
                                "Preparing",  "Shipping", 
                                "Delayed", "Shipped" 
                            ].includes(status)
                    },
                    { [style.active]: status === "Completed" }
                )}
            >
                <div className={style.title}>Đã hoàn thành</div>
            </div>: undefined }
            

            <div
                className={classNames(
                    style.item,
                    {
                        [style.deActive]:
                         [
                            "Pending", "Processing", 
                            "Preparing",  "Shipping", 
                            "Delayed",  "Shipped",  
                            "Completed",  "Cancelled" 
                        ].includes(status)
                    },
                    { [style.active]: status === "Closed" }
                )}
            >
                <div className={style.title}>Đã kết thúc</div>
            </div>
        </div>
    );
};

export default Timeline;
