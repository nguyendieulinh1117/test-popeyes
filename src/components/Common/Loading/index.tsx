import React from 'react';
import style from './index.module.scss';
import LoadGif from "@assets/icons/loading.gif";
import CachedImage from '../CachedImage';
import classNames from 'classnames';

type propsType = {
    active: boolean
}

const Loading = (props: propsType) => {
    return ( 
        <div className={classNames(style.loading, {[style.active]: props.active})}>
            <CachedImage src={LoadGif.src} />
        </div>
    );
}

export default Loading;