import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { useContext } from 'react'
import style from './index.module.scss';
import { ProfileContext } from '../ProfileContext';

const Notification = () => {
    const {
        errorNotification,
        activeNotification,
        messageNotification
    } = useContext(ProfileContext);

    return <div className={classNames(style.notification, {[style.active]: activeNotification}, {[style.error]: errorNotification})} >
        {messageNotification}
    </div>
}

export default Notification;