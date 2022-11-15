import React, { useState, useEffect } from "react";
import useDevices from "@hooks/useDevices"

const Desktop = ({ children }: any) => {
    const { isDesktop } = useDevices();
    const [content, setContent] = useState<any>(children);
    useEffect(() => {
        if (isDesktop) {
            setContent(children);
        }
        else {
            setContent(null);
        }
    }, [children, isDesktop])
    return content || <></>;
}

const Mobile = ({ children }: any) => {
    const { isMobile } = useDevices();
    const [content, setContent] = useState<any>();
    useEffect(() => {
        if (isMobile) {
            setContent(children);
        }
        else {
            setContent(null);
        }
    }, [children, isMobile])
    return content || <></>;
}

export {
    Desktop,
    Mobile,
};