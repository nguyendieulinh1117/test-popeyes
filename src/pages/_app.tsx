import type { AppContext } from "next/app";
import createEmotionCache from "@utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import MainLayout from "@@MainLayout";
import { NextQueryParamProvider } from "@hocs/NextQueryParamProviderComponent";

import "@assets/scss/index.scss";
import { wrapper } from "@redux/store";
import { END } from "redux-saga";
import {  dynamicActions, storeActions } from "@redux/actions";
import Script from "next/script";
import { useRouter } from "next/router";
import ClientSideRender from "@hocs/ClientSideRender";

const clientSideEmotionCache = createEmotionCache();

const App = ({ pageProps, Component, ...props }: any) => {
    const router = useRouter();
    const { emotionCache = clientSideEmotionCache } = props;
    return (
        <NextQueryParamProvider>
            <script async src="//vmstylevn.api.useinsider.com/ins.js?id=10007379"></script>
            {/* <!-- Google tag (gtag.js) --> */}
        
            {
                ['/gio-hang', '/thanh-toan'].includes(router.pathname) ? 
                <ClientSideRender>
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-SKMFVE8RRL"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments)};
                            gtag('js', new Date());
                            gtag('config', 'G-SKMFVE8RRL');
                        `}
                    </Script>
                </ClientSideRender>
                : 
                <>
                    <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-SKMFVE8RRL"
                    strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments)};
                            gtag('js', new Date());
                            gtag('config', 'G-SKMFVE8RRL');
                        `}
                    </Script>
                </>
            }
            
            <Script>
                {
                    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','G-SKMFVE8RRL');`
                }
            </Script>
            <CacheProvider value={emotionCache}>
                <MainLayout>
                    <Component {...pageProps} key={router.asPath} />
                </MainLayout>
            </CacheProvider>
        </NextQueryParamProvider>
    );
};

App.getInitialProps = wrapper.getInitialAppProps((store): any => async (appContext: AppContext) => {
    const { Component, ctx } = appContext;
    if (Component.getInitialProps) {
        await Component.getInitialProps(ctx);
    }

    // 2. Stop the saga if on server

    if (ctx.req) {
        await store.dispatch(dynamicActions.getDynamicContentCommon()); //{key: policys.COMMON_HEADER_FOOTER_CONTENTS}
        store.dispatch(storeActions.getTotalStores({}));
        await store.dispatch(END);
        await store.sagaTask.toPromise();
    }
});

export default wrapper.withRedux(App);
