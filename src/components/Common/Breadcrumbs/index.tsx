import React from 'react';
import Link from 'next/link';
import classNames from 'classnames';

import { Desktop } from '@@@Media';

import styles from './index.module.scss';

type BreadcrumbsPropTypes = {
    breadcrumbs?: any,
    className?: string,
}

const Breadcrumbs = ({ breadcrumbs, className }: BreadcrumbsPropTypes) => {

    if (breadcrumbs?.length) {
        return (
            <Desktop>
                <div className={classNames(styles.breadcrumbs, className)} >
                    <div className="container">
                        <nav>
                            <ol itemScope itemType="http://schema.org/BreadcrumbList">
                                {
                                    breadcrumbs?.map((value: any, key: string) => (
                                        <li key={key} className={classNames({
                                            [styles.item]: true,
                                            [styles.itemActive]: value?.active === true,
                                        })} itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
                                            {value?.url ? (
                                                <>
                                                    <Link href={value?.url}  passHref>
                                                        <a itemProp="item">
                                                            <span itemProp="name" dangerouslySetInnerHTML={{ __html: value?.label }} />
                                                        </a>
                                                    </Link>
                                                    <meta itemProp="position" content={key + 1} />
                                                </>
                                            ) : (
                                                <>
                                                    <a itemProp="item">
                                                        <span itemProp="name" dangerouslySetInnerHTML={{ __html: value?.label }} />
                                                    </a>
                                                    <meta itemProp="position" content={key + 1} />
                                                </>
                                            )}
                                        </li>
                                    ))
                                }
                            </ol>
                        </nav>
                    </div>
                </div>
            </Desktop>
        )
    }

    return <></>;
}

export default Breadcrumbs;
