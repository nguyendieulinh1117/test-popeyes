import Document, { Html, Head, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* code that you want to add to the header */}
         
          <script 
            dangerouslySetInnerHTML={{
            __html:`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '817881366010601');
              fbq('track', 'PageView');`,
            }} 
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPPLZDW"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=817881366010601&ev=PageView&noscript=1" />`,
            }}
          />
        </body>
       
      </Html>
    )
  }
}