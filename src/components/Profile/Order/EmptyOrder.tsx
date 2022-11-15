import React from "react";

import Button from "@@@Form/Button";

import style from "./EmptyOrder.module.scss";
import { useRouter } from "next/router";
import { paths } from "@constants";

type emtyProps = {
    message: string;
};
const EmptyOrder = (props: emtyProps) => {
    const router = useRouter();
    const { message } = props;

    return (
        <div className={style.emtyListOrder}>
            <span>{message}</span>
            <Button buttonStyle="secondary" className={style.btnSubmit} onClick={()=>router.push(paths.home)}>
                Tiếp tục mua sắm
            </Button>
        </div>
    );
};

export default EmptyOrder;
