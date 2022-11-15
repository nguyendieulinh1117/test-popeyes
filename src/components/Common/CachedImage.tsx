import React from 'react';

import IconNoImage from '@assets/icons/no-image.svg';

type CachedImagePropTypes = {
    src?: string,
    alt?: string,
    children?: any,
    width?: string,
    height?: string,
}

const CachedImage = ({ src, alt = 'photo', children, width, height }: CachedImagePropTypes) => {
    const [isUnavailable, setUnavailable] = React.useState(false);

    if (!src || isUnavailable) {
        return (
            children || 
            (
                <div style={
                    { 
                        width: width ? width : 'auto', 
                        height: height ? height : 'auto',
                        lineHeight: '0',
                    }
                }> 
                    <IconNoImage width='100%' height='100%' /> 
                </div>
            )
        );
    }

    return (
        <img
            src={src}
            srcSet={`${src} 1x`}
            alt={alt}
            onError={() => setUnavailable(true)}
        />
    );
};

export default CachedImage;

