import IconLogo from "@assets/icons/logo-no-text.svg";
export const ssrMode = typeof window === "undefined";

export const VmeApiUrl = process.env.NEXT_PUBLIC_VME_API_GATEWAY_URL;

const baseUrl = "/";

export const policys: any = {
    CHINH_SACH_MUA_HANG: "chinh-sach-mua-hang",
    CHINH_SACH_VAN_CHUYEN: "chinh-sach-van-chuyen",
    CHINH_SACH_DOI_TRA: "quy-dinh-doi-tra",
    CHINH_SACH_THANH_TOAN: "chinh-sach-thanh-toan",
    CHINH_SACH_BAO_MAT: "chinh-sach-bao-mat",
};

export const commonKeys = {
    COMMON_HEADER_FOOTER_CONTENTS: "common-header-footer-contents",
};

export const paths = {
    home: baseUrl,
    cart: `${baseUrl}gio-hang`,
    checkout: `${baseUrl}thanh-toan`,
    orderSuccess: `${baseUrl}don-hang/thanh-cong`,
    orderFail: `${baseUrl}don-hang/that-bai`,
    orderCancel: `${baseUrl}don-hang/da-huy`,
    login: `${baseUrl}login`,
    register: `${baseUrl}register`,
    forgetPassword: `${baseUrl}forget-password`,
    store: `${baseUrl}cua-hang`,
    collection: `${baseUrl}bo-suu-tap`,
    categories: `${baseUrl}`,
    productDetail: `${baseUrl}san-pham`,
    productSale: `${baseUrl}san-pham/sale`,
    // profile: `${baseUrl}profile`,
    policies: `${baseUrl}dieu-khoan`,
    policyPurchase: `${baseUrl}chinh-sach/${policys.CHINH_SACH_MUA_HANG}`,
    policyShipping: `${baseUrl}chinh-sach/${policys.CHINH_SACH_VAN_CHUYEN}`,
    policyPayment: `${baseUrl}chinh-sach/${policys.CHINH_SACH_THANH_TOAN}`,
    policyReturn: `${baseUrl}chinh-sach/${policys.CHINH_SACH_DOI_TRA}`,
    policySecret: `${baseUrl}chinh-sach/${policys.CHINH_SACH_BAO_MAT}`,

    profile: {
        index: `${baseUrl}ho-so`,
        information: `${baseUrl}ho-so/thong-tin-ca-nhan`,
        changePassword: `${baseUrl}ho-so/thay-doi-mat-khau`,
        order: {
            index: `${baseUrl}ho-so/don-hang-cua-toi`,
            pending: `${baseUrl}ho-so/don-hang-cua-toi/da-nhan`,
            process: `${baseUrl}ho-so/don-hang-cua-toi/dang-xu-ly`,
            shipped: `${baseUrl}ho-so/don-hang-cua-toi/da-giao`,
            cancel: `${baseUrl}ho-so/don-hang-cua-toi/da-huy`,
            complete: `${baseUrl}ho-so/don-hang-cua-toi/da-hoan-thanh`,
            delay: `${baseUrl}ho-so/don-hang-cua-toi/dang-hoan`,
            shipping: `${baseUrl}ho-so/don-hang-cua-toi/dang-giao`,
            preparing: `${baseUrl}ho-so/don-hang-cua-toi/dang-chuan-bi`,
            requestCancel: `${baseUrl}ho-so/don-hang-cua-toi/dang-yeu-cau-huy`,
            closed: `${baseUrl}ho-so/don-hang-cua-toi/da-ket-thuc`,
        },
        detailOrder: `${baseUrl}ho-so/chi-tiet-don-hang`,
        address: `${baseUrl}ho-so/dia-chi`,
        updateAddress: `${baseUrl}ho-so/cap-nhat-dia-chi`,
        createAddress: `${baseUrl}ho-so/tao-moi-dia-chi`,
    },

    blog: `${baseUrl}tin-tuc`,
    blogDetail: `${baseUrl}tin-tuc/[slug]`,
    about: `${baseUrl}ve-chung-toi`,
    recruitment: `${baseUrl}tuyen-dung`,
    trackingOrder: `${baseUrl}theo-doi-don-hang`,
};

export const socialLink = {
    facebook: "https://www.facebook.com/vmstylevn",
    instagram: "https://www.instagram.com/vmstyle.vn",
    shopee: "https://shopee.vn/vmstyle",
    lazada: "https://www.lazada.vn/shop/vm-style",
    tiktok: "https://www.tiktok.com/@vmstyle.vn",
    youtube: " https://www.youtube.com/channel/UCGyJAWAWhgUCoGBtVE8pLjg",
};

export const storageKeys = {
    USER_DATA: "ave-user-data",
    USER_TOKEN: "ave-user-token",
    DATA_THEME: "ave-data-theme",
    BASKET_ID: "ave-basket-id",
    CONTENT_DYNAMIC: "ave-content-dynamic",
    POSITION: "ave-position",
    PROMOTION: "ave-promotion",
    PROMOTION_ERROR: "ave-promotion-error",
    PROMOTION_SUCCESS: "ave-promotion-success",
    USER_REFRESH_TOKEN: "ave-user-refresh-token",
    PURCHASED: 'ave-purchased-ga'
};

export const phoneRegExp = /^(03|05|07|08|09|01[2|6|8|9]){1}([0-9]{8})$/;
export const numberRegExp = /(\+84|84|0[3|5|7|8|9])+([0-9]{8}|[0-9]{9})\b/;
export const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const breadcrumbsData = [
    {
        label: "Trang chủ",
        url: paths.home,
        active: false,
    },
    {
        label: "Hồ sơ",
        url: paths.profile.index,
        active: false,
    },
    {
        label: "Đổi mật khẩu",
        active: true,
    },
];

import Icon from "@assets/icons/logo.png";

export const metaDefaults = () => ({
    description:
        "VM STYLE - Thương hiệu thời trang dành cho giới trẻ. Kiểu dáng đa dạng phù hợp với mọi phong cách.",
    image: Icon.src,
    title: " VM STYLE - Thời Trang Trẻ ",
    type: "website",
    url: "vmstyle.vn",
});
