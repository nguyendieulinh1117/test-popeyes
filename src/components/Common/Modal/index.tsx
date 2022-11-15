import React, { useEffect } from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';

import Button from '@@@Form/Button';
import { useOutsideClick } from "@hooks/useOutsideClick";

import IconClose from '@assets/icons/clode-light.svg';
import styles from './index.module.scss';

type BaseModalPropTypes = {
    mobileCenter?: string,
    isOpen?: any,
    title?: string,
    children?: any,
    onClose?: Function,
    onCancel?: Function,
    onConfirm?: Function,
    footer?: any,
    headerClass?: string,
    bodyClass?: string,
    footerClass?: string,
    confirmButtonProps?: any,
    cancelButtonProps?: any,
    confirmButtonLabel?: string,
    cancelButtonLabel?: string,
    contentClass?: string,
    overlayClass?: string,
    overflowHandel?: boolean,
    disabledBtn?: boolean,
    typeBtn?: string,
}

const BaseModal = ({
    mobileCenter,
    isOpen,
    title,
    children,
    onClose,
    onCancel,
    onConfirm,
    footer,
    headerClass,
    bodyClass,
    footerClass,
    confirmButtonProps,
    cancelButtonProps,
    confirmButtonLabel = 'Lưu',
    cancelButtonLabel = 'Bỏ qua',
    contentClass,
    overlayClass,
    overflowHandel = true,
    disabledBtn = false,
    typeBtn = 'button'
}: BaseModalPropTypes) => {
    const hasFooter = !!footer || onCancel || onConfirm
    const modalRef: any = useOutsideClick(onClose, false, false);
    
    useEffect(() => {
        if (overflowHandel) {
            let prevOverflowStyle: any;
            if (isOpen) {
                prevOverflowStyle = document.body.style.overflow || ''
                document.body.style.overflow = 'hidden'
            }

            return () => {
                document.body.style.overflow = prevOverflowStyle
            }
        }
    }, [isOpen])

    useEffect(() => {
        Modal.setAppElement('body');
    }, [])

    return (
        <Modal
            isOpen={isOpen}
            className={classNames(
                styles.baseModalContent,
                contentClass,
                mobileCenter && styles.mobileCenter
            )}
            overlayClassName={classNames(styles.baseModalOverlay, overlayClass)}
            ref={modalRef}
        >
            <div className={classNames(styles.header, headerClass)}>
                <div className={styles.title}>
                    {title}
                </div>
                {onClose && (
                    <button
                        type='button'
                        className={styles.closeIcon}
                        onClick={() => onClose && onClose()}
                    >
                        <IconClose stroke="#112950" />
                    </button>
                )}
            </div>
            <div className={classNames(styles.body, bodyClass)}>
                {children}
            </div>
            {hasFooter && (
                <div className={classNames(styles.footer, footerClass)}>
                    {footer}
                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            className={styles.save}
                            buttonStyle="secondary"
                            type={typeBtn}
                            bold
                            {...confirmButtonProps}
                            disabled={disabledBtn}
                        >
                            {confirmButtonLabel}
                        </Button>
                    )}
                     {onCancel && (
                        <Button
                            onClick={onCancel}
                            className={styles.back}
                            {...cancelButtonProps}
                        >
                            {cancelButtonLabel}
                        </Button>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default BaseModal;