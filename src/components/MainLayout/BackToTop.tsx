import React, { useEffect, useRef } from "react";
import * as Scroll from "react-scroll";

import IconBackToTop from '@assets/icons/back-to-top.svg';
import styles from "./BackToTop.module.scss";

const BackToTop = () => {
    const BackTopRef: any = useRef();

    const scrollToTop = () => {
        let scroll = Scroll.animateScroll;
        scroll.scrollToTop({ smooth: true });
    };

    const trackScrolling = () => {
        const currentPos = window.pageYOffset;
        if (BackTopRef.current) {
            if (currentPos > 0) {
                BackTopRef.current.style.display = "block";
            } else {
                BackTopRef.current.style.display = "none";
            }
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', trackScrolling);

        return () => {
            document.removeEventListener('scroll', trackScrolling);
        }
    }, []);

    return (
        <div ref={BackTopRef} className={styles.scrollToTopWrapper}>
            <button
                type="button"
                className={styles.scrollToTop}
                onClick={() => scrollToTop()}
            >
                <IconBackToTop />
            </button>
        </div>
    );
}

export default BackToTop;