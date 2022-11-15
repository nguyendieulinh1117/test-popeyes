import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames'

import IconArrowRight from '@assets/icons/arrow-line.svg';

import styles from './index.module.scss';

type CompactContentPropTypes = {
    className?: string,
    isOpen?: boolean,
    children?: any,
    toggleOpen?: any,
    compactHeight?: number,
    toggleButton?: number,
    forceShowFullContent?: number,
    defaultOpen?: boolean,
    toggleButtonClass?: string,
    toggleButtonLabelMore?: string,
    toggleButtonLabelLess?: string,
}

const CompactContent = ({
    className,
    children,
    isOpen,
    toggleOpen,
    compactHeight = 200,
    toggleButton,
    forceShowFullContent,
    defaultOpen = false,
    toggleButtonClass,
    toggleButtonLabelMore = 'Xem tất cả',
    toggleButtonLabelLess = 'Thu gọn'
}: CompactContentPropTypes) => {
    const [isOpenInternal, setIsOpenInternal] = useState<boolean>(defaultOpen);
    const [isShortContent, setIsShortContent] = useState<boolean>(false);
    const contentRef: any = useRef()

    const currentIsOpen = isOpen ?? isOpenInternal
    const currentToggleOpen = toggleOpen ?? (() => setIsOpenInternal((prev: any) => !prev))
    const fullContentHeight = contentRef.current?.offsetHeight || 'fit-content'
    const hasToggle = !isShortContent && !forceShowFullContent

    const currentHeightShow = useMemo(() => {
        if (isShortContent || forceShowFullContent) {
            return 'fit-content'
        }

        return currentIsOpen ? fullContentHeight : compactHeight
    }, [currentIsOpen, isShortContent, fullContentHeight, forceShowFullContent])

    useEffect(() => {
        setIsShortContent(contentRef.current?.offsetHeight <= compactHeight)
    }, [])

    return (
        <div
            className={classnames({
                className,
                [styles.compactContent]: true,
                [styles.open]: currentIsOpen,
                [styles.hasToggle]: hasToggle
            })}
        >
            <div
                className={styles.container}
                style={{
                    height: currentHeightShow
                }}
            >
                <div
                    className={styles.content}
                    ref={contentRef}
                >
                    {children}
                </div>
            </div>

            {hasToggle && (
                toggleButton ?? (
                    <div className={classnames(styles.toggleButton, toggleButtonClass)}>
                        <button type="button" onClick={currentToggleOpen}>
                            {currentIsOpen ? toggleButtonLabelLess : toggleButtonLabelMore}
                            <IconArrowRight />
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default CompactContent;