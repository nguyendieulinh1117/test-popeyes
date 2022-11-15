import { VmeApiUrl } from "./index";

const baseHeader = {
    "Content-Type": "application/json",
};

const multipartFormHeader = {
    "Content-Type": "multipart/form-data",
};

interface objMethod {
    path: string;
    method: string;
    headers: object;
}

type ApiConfig = {
    authenticate: {
        register: objMethod;
        login: objMethod;
        getUserByToken: objMethod;
        updateProfile: objMethod;
        changePassword: objMethod;
        forgetPassword: objMethod;
        resetPassword: objMethod;
        userExist: objMethod;
    };
    address: {
        getAddress: objMethod;
        addAddress: objMethod;
        updateAddress: objMethod;
        deleteAddress: objMethod;
    };
    collection: {
        getAllCollection: objMethod;
        createCollection: objMethod;
        getProdDetail: objMethod;
    };
    model: {
        getAllModel: objMethod;
    };
    stores: {
        getProvinces: objMethod;
        getStores: objMethod;
        getProvinceDetail: objMethod;
    };
    product: {
        getCategories: objMethod,
        getProductSlug: objMethod,
        getProductFilter: objMethod,
    };
    banner: {
        getListBanner: objMethod;
    };
    content: {
        getListContent: objMethod;
    };
    dynamicContent: {
        getDynamicContentByKey: objMethod;
    };
    basket: {
        getBasket: objMethod;
        storeBasket: objMethod;
        updateBasket: objMethod;
        deleteBasket: objMethod
    };
    order: {
        getOrders: objMethod;
        getOrderByCode: objMethod;
        createOrder: objMethod;
    },
    payment: {
        getPaymentMethod: objMethod;
        orderPayment: objMethod;
    },
    promotion: {
        getAllPromotion: objMethod;
        checkPromotion: objMethod;
        getCoupon: objMethod;
    },
    delivery: {
        services: objMethod;
        calculateFee: objMethod;
        delivery: objMethod;
    },
    combos: {
        getComboDetail: objMethod;
    },
};

const apiConfig: ApiConfig = {
    authenticate: {
        register: {
            path: `${VmeApiUrl}api/v1/register`,
            method: "POST",
            headers: baseHeader,
        },
        login: {
            path: `${VmeApiUrl}api/v1/auth`,
            method: "POST",
            headers: baseHeader,
        },
        getUserByToken: {
            path: `${VmeApiUrl}api/v1/profile`,
            method: "GET",
            headers: baseHeader,
        },
        updateProfile: {
            path: `${VmeApiUrl}api/v1/profile`,
            method: "PUT",
            headers: baseHeader,
        },
        changePassword: {
            path: `${VmeApiUrl}api/v1/profile/password`,
            method: "PUT",
            headers: baseHeader,
        },
        userExist: {
            path: `${VmeApiUrl}api/v1/users`,
            method: "GET",
            headers: baseHeader,
        },
        forgetPassword: {
            path: `${VmeApiUrl}api/v1/forget-password`,
            method: "POST",
            headers: baseHeader,
        },
        resetPassword: {
            path: `${VmeApiUrl}api/v1/reset-password`,
            method: "POST",
            headers: baseHeader,
        }
        
    },

    address: {
        getAddress: {
            path: `${VmeApiUrl}api/v1/addresses`,
            method: "GET",
            headers: baseHeader,
        },
        addAddress: {
            path: `${VmeApiUrl}api/v1/addresses`,
            method: "POST",
            headers: baseHeader,
        },
        updateAddress: {
            path: `${VmeApiUrl}api/v1/addresses`,
            method: "PUT",
            headers: baseHeader,
        },
        deleteAddress: {
            path: `${VmeApiUrl}api/v1/addresses`,
            method: "DELETE",
            headers: baseHeader,
        },
    },

    collection: {
        getAllCollection: {
            path: `${VmeApiUrl}api/v1/collections`,
            method: "GET",
            headers: baseHeader,
        },
        createCollection: {
            path: `${VmeApiUrl}api/collections/create-collection`,
            method: "POST",
            headers: multipartFormHeader,
        },
        getProdDetail: {
            path: `${VmeApiUrl}api/v1/products`,
            method: "GET",
            headers: baseHeader,
        },
    },
    model: {
        getAllModel: {
            path: `${VmeApiUrl}api/model`,
            method: "GET",
            headers: baseHeader,
        },
    },

    stores: {
        getProvinces: {
            path: `${VmeApiUrl}api/v1/provinces`,
            method: "GET",
            headers: baseHeader,
        },
        getStores: {
            path: `${VmeApiUrl}api/v1/stores`,
            method: "GET",
            headers: baseHeader,
        },
        getProvinceDetail: {
            path: `${VmeApiUrl}api/v1/provinces`,
            method: "GET",
            headers: baseHeader,
        },
    },
    product: {
        getCategories: {
            path: `${VmeApiUrl}api/v1/categories`,
            method: 'GET',
            headers: baseHeader
        },
        getProductSlug: {
            path: `${VmeApiUrl}api/v1/products`,
            method: 'GET',
            headers: baseHeader
        },
        getProductFilter: {
            path: `${VmeApiUrl}api/v1/products/filters`,
            method: 'GET',
            headers: baseHeader
        },
    },
    banner: {
        getListBanner: {
            path: `${VmeApiUrl}api/v1/banners`,
            method: "GET",
            headers: baseHeader,
        },
    },
    content: {
        getListContent: {
            path: `${VmeApiUrl}api/v1/contents`,
            method: "GET",
            headers: baseHeader,
        },
    },
    dynamicContent: {
        getDynamicContentByKey: {
            path: `${VmeApiUrl}api/v1/dynamic-contents`,
            method: "GET",
            headers: baseHeader,
        }
    },
    basket: {
        getBasket: {
            path: `${VmeApiUrl}api/v1/baskets`,
            method: "GET",
            headers: baseHeader,
        },
        storeBasket: {
            path: `${VmeApiUrl}api/v1/baskets`,
            method: "POST",
            headers: baseHeader,
        },
        updateBasket: {
            path: `${VmeApiUrl}api/v1/baskets`,
            method: "PUT",
            headers: baseHeader,
        },
        deleteBasket: {
            path: `${VmeApiUrl}api/v1/baskets`,
            method: "DELETE",
            headers: baseHeader,
        }
    },
    order: {
        getOrders: {
            path: `${VmeApiUrl}api/v1/orders`,
            method: "GET",
            headers: baseHeader,
        },
        getOrderByCode: {
            path: `${VmeApiUrl}api/v1/orders`,
            method: "GET",
            headers: baseHeader,
        },
        createOrder: {
            path: `${VmeApiUrl}api/v1/orders`,
            method: "POST",
            headers: baseHeader,
        }
    },
    payment: {
        getPaymentMethod: {
            path: `${VmeApiUrl}api/v1/payment-methods`,
            method: "GET",
            headers: baseHeader,
        },
        orderPayment: {
            path: `${VmeApiUrl}api/v1/payments`,
            method: "POST",
            headers: baseHeader,
        }
    },
    promotion: {
        getAllPromotion: {
            path: `${VmeApiUrl}api/v1/promotions`,
            method: "GET",
            headers: baseHeader,
        },
        checkPromotion: {
            path: `${VmeApiUrl}api/v1/promotions/check`,
            method: "POST",
            headers: baseHeader,
        },
        getCoupon: {
            path: `${VmeApiUrl}api/v1/coupons`,
            method: "GET",
            headers: baseHeader,
        },
    },
    delivery: {
        services: {
            path: `${VmeApiUrl}api/v1/delivery/services`,
            method: "POST",
            headers: baseHeader,
        },
        calculateFee: {
            path: `${VmeApiUrl}api/v1/delivery/calculate-fee`,
            method: "POST",
            headers: baseHeader,
        },
        delivery: {
            path: `${VmeApiUrl}api/v1/delivery`,
            method: "POST",
            headers: baseHeader,
        },
    },
    combos: {
        getComboDetail:{
            path: `${VmeApiUrl}api/v1/combos`,
            method: "GET",
            headers: baseHeader,
        },
    },
};

export default apiConfig;
