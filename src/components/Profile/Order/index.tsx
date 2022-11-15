import React, { useState } from "react";
import style from "./index.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

//component
import BasicForm from "@components/Common/Form/BasicForm";
import IconLeft from "@assets/icons/arrow-left.svg";
import StatusTabBar from "./StatusTabBar";
import InputTextField from "@components/Common/Form/InputTextField";
import IconSearch from "@assets/icons/search.svg";
import ListOrder from "./ListOrder";
import { paths } from "@constants";
import { Mobile } from "@components/Common/Media";
import { useDispatch } from "react-redux";
import { orderActions } from "@redux/actions";

const MyOrder = () => {
    const route = useRouter();
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState<string>("");
    const [timeOutSearch, setTimeOutSearch] = useState<any>(0);

    const { status, key } = route.query;

    const handleSearch = (value: string) => {
        dispatch(orderActions.getOrders({ code: value }));
    };

    const onChangeSearch = (event: any) => {
        clearTimeout(timeOutSearch);
        setSearchValue(event);
        if (event.trim().length > 0) {
            setTimeOutSearch(
                setTimeout(() => {
                    handleSearch(event);
                    window.location.assign(`${window.location.pathname}?key=${event}`);
                    // route.push(route.pathname, { query: { key: event } }, { shallow: true });
                }, 500)
            );
        } else {
            dispatch(orderActions.getOrders({}));
            window.location.assign(`${window.location.pathname}`);
        }
    };

    return (
        <div className={style.myOrder}>
            <Mobile>
                <div className={style.titleForm}>
                    ĐƠN HÀNG CỦA TÔI
                    <Link href={paths.profile.index} passHref>
                        <div className={style.returnBtn}>
                            <IconLeft />
                        </div>
                    </Link>
                </div>
            </Mobile>
            <StatusTabBar query={key} statusActive={status || "all"} />
            <BasicForm
                enableReinitialize={true}
                initialValues={{
                    search: key,
                }}
            >
                <InputTextField
                    iconLeft={<IconSearch />}
                    className={style.btnSearch}
                    placeholder="Tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm."
                    name="search"
                    onChange={onChangeSearch}
                />
            </BasicForm>
            <ListOrder query={key} />
        </div>
    );
};

export default MyOrder;
