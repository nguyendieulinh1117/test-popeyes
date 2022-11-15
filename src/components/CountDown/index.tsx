import React from "react";

import useCountDown from "@hooks/useCountDown";

import styles from "./index.module.scss";

const CountDown = ({ countDownTime }: any) => {
    const time = useCountDown({countDownTime});

    return (
        <div className={styles.countdownWrapper}>
            <span className={styles.countdownItem}>{time?.days || "0"}</span> :
            <span className={styles.countdownItem}>{time?.hours || "00"}</span> :
            <span className={styles.countdownItem}>{time?.minutes || "00"}</span> :
            <span className={styles.countdownItem}>{time?.seconds || "00"}</span>
        </div>
    );
}

export default CountDown;