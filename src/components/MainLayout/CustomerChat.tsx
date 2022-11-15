import React from "react";
import { paths } from "@constants";
import { useRouter } from "next/router";
import MessengerCustomerChat from 'react-messenger-customer-chat';

const CustomerChat = () => {
    const {pathname} = useRouter();
    const hideMess = [
        paths.cart,
        paths.checkout,
        '/[categories]'
    ].includes(pathname);
    return (
        !hideMess? 
        // <>
            
        //   <div id="fb-root" ></div>
            
        //     <script
        //     dangerouslySetInnerHTML={{
        //         __html: `
        //          var chatbox = document.getElementById('fb-customerchat');
        //         chatbox.setAttribute("theme_color", "#DC3A35");
        //         chatbox.setAttribute("attribution", "page_inbox");
        //         chatbox.setAttribute("page_id", "1633707666849678");
        //         window.fbAsyncInit = function() {
        //         FB.init({
        //             xfbml            : true,
        //             version          : 'v14.0'
        //         });
        //         };
        //         (function(d, s, id) {
        //         var js, fjs = d.getElementsByTagName(s)[0];
        //         if (d.getElementById(id)) return;
        //         js = d.createElement(s); js.id = id;
        //         js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        //         fjs.parentNode.insertBefore(js, fjs);
        //         }(document, 'script', 'facebook-jssdk'));
        //         `,
        //     }}
        //     />
        //     <div className="fb-customerchat" id="fb-customerchat"
        //     // theme_color="#DC3A35"
        //     // attribution="page_inbox"
        //     // page_id="1633707666849678"
        //     />
        // </>
        <MessengerCustomerChat pageId="1633707666849678" appId="472694953267781" themeColor="#DC3A35"/>
        : <></>
    );
}

export default CustomerChat;