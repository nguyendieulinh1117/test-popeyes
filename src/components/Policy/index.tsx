import React from "react";

import Breadcrumbs from "@@@Breadcrumbs";

import styles from "./index.module.scss";
import Notfound404 from "@hocs/Notfound404";

type valuePolicy = {
    title: string | null,
    content: string | null,
}

type ContentValue = {contenValue:valuePolicy}

const Policy = ({contenValue}:ContentValue) => {
    
    
    const breadcrumbsData = [
        {
            label: 'Trang chủ',
            url: '/',
            active: false,
        },
        {
            label: contenValue?.title,
            active: true,
        },
    ];

    return (
        <Notfound404 condition={!!contenValue} >
            <div className={styles.policy}>
                <Breadcrumbs breadcrumbs={breadcrumbsData} />
                <div className="container">
                    <div className={styles.box}>
                        <div className={styles.title}>
                            <h3>{contenValue?.title}</h3>
                        </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{__html: contenValue?.content as any}}>
                        </div>
                    </div>
                </div>
            </div>
        </Notfound404>
    );
}

export default Policy;