import { useEffect, useState } from 'react';
import { ssrMode } from '@constants';

const calcDevices = ( width: number) => {
    const isMobile = width < 992;
    const isDesktop = width >= 992;
    return {
        isMobile,
        isDesktop,
    };
}

const useDevices = () => {

    const windowInnerWidth = ssrMode ? 1440 : window.innerWidth;
    const [devices, setDevices] = useState<any>(calcDevices(windowInnerWidth));

    const handleResize = (e: any) => {
        setDevices(calcDevices(e.target.innerWidth));
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return devices;
}

export default useDevices;
