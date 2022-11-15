import React from "react";

import styles from "./Login.module.scss";

const Login = ({ setShow }: any) => {
    return (
        <div className={styles.login} onClick={() => setShow(true)}>
            <div className={styles.title}>ĐĂNG NHẬP</div>
        </div>
    );
};

export default Login;
