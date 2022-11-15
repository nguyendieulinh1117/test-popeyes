import * as React from "react";
import Head from "next/head";

import { metaDefaults } from "@constants";
import { cleanObject } from "@utils";
import { useSelectorTyped } from "@hooks/useSelectorType";

const MetaWrapper = ({ children, meta, condition = false }: any) => {
    const test = useSelectorTyped((state) => state);
    const { title, description, image, type, url} = {
        ...metaDefaults(),
        ...cleanObject(meta),
    };

    let urlClean = url;
    let parts = urlClean.split("?");
    if (parts[1] != undefined || parts[1] != "") {
        urlClean = parts[0];
    }

    return (
        <>
            {condition ? undefined :
                <Head>
                    <meta charSet="UTF-8" />
                    <link rel="icon" href="/logo.png" />
                    {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> */}
                    <meta
                        name="robots"
                        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                    />
                    <meta name="revisit-after" content="1 days" />
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <meta property="og:url" name="og:url" content={urlClean} />
                    <meta name="og:title" property="og:title" content={title} />
                    <meta property="og:type" content={type} />
                    <meta name="og:description" property="og:description" content={description} />
                    <meta property="og:image" name="og:image" content={image} />
                    <meta property="og:image:secure_url"  content={image} />
                    <meta name="twitter:card" content="summary_large_image" />
                    {/* <meta property="twitter:domain" content={hostname} /> */}
                    <meta property="twitter:url" content={urlClean} />
                    <meta name="twitter:title" content={title} />
                    <meta name="twitter:description" content={description} />
                    <meta name="twitter:image" content={image} />
                    <link rel="canonical" href={urlClean} />

                    <meta
                        name="robots"
                        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                    />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="revisit-after" content="1 days" />
                    <meta name="facebook-domain-verification" content="4sb9w8vu4oulm52fu658jo45dej62a" />
                </Head>
            }
            {children}
        </>
    );
};

export default MetaWrapper;
