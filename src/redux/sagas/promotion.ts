import { call, put, takeLatest } from "redux-saga/effects";

import apiConfig from "@constants/apiConfig";
import { loadingActions, promotionActionTypes } from "src/redux/actions";
import { processCallbackAction, processLoadingAction } from "../helper";
import { RequestApi } from "@common/Models/ApiModels";
import { handleApiResponse, sendRequest } from "@utils/api";

const { PROMOTION_CHECK, GET_LIST_VOUCHER, GET_LIST_PROMOTION, DELETE_VOUCHER } =
    promotionActionTypes;

const getAllPromotion = (payload: RequestApi<any>) => {
    return processLoadingAction(apiConfig.promotion.getAllPromotion, payload);
};

function* checkPromotions({ payload }: RequestApi<any>): any {
    yield put(loadingActions.startLoading(PROMOTION_CHECK));
    const { actionrequest, onCompleted, onError, onMess } = payload;
    const { params, baskets } = actionrequest;
    try {
        const result = yield call(sendRequest, apiConfig.promotion.checkPromotion, params);

        if (result.success) {
            let voucherData = result?.responseData?.data;

            if (voucherData?.isValid) {
                const options = {
                    ...apiConfig.basket.updateBasket,
                    path: `${apiConfig.basket.updateBasket.path}/${baskets.basketId}`,
                };
                let bonusOldArr: any[] = baskets.bonusProducts.filter((e) => e.promotion !== null);
                let bonusArr: any[] = [];

                if (voucherData?.bonusItems?.length > 0) {
                    voucherData?.bonusItems?.forEach((element) => {
                        if (!bonusOldArr.some((e) => e.id === element?.productId)) {
                            const stockArr = element.product.stocks.filter(
                                (e: any) => e.quantity >= element?.quantity
                            );
                            let skuBonus = stockArr[Math.floor(Math.random() * stockArr.length)];

                            const mappingsBonus = element.product.mappings.find(
                                (e: any) => e.sku === skuBonus.sku
                            );

                            let opt: any[] = [];
                            if (mappingsBonus) {
                                mappingsBonus.uniqueOptionIds.forEach((element) => {
                                    opt.push({
                                        id: element,
                                    });
                                });
                            }
                            bonusArr.push({
                                id: element?.productId,
                                slug: element?.product?.slug,
                                name: element?.product?.name,
                                imageUrl: element?.product.images[0]?.imageUrl,
                                quantity: element?.quantity,
                                discount: element?.product?.discount,
                                price: element?.product?.salePrice,
                                promotion: null,
                                sku: skuBonus.sku,
                                options: opt,
                            });
                        }
                    });
                }

                const basketsBody = {
                    ...baskets,
                    voucher: {
                        code: params?.code,
                        name: voucherData?.promotionName,
                        discount: voucherData?.discount,
                        bonusItems: voucherData?.bonusItems,
                    },
                    bonusProducts: [...bonusOldArr, ...bonusArr],
                };
                const basketResult = yield call(sendRequest, options, basketsBody);

                if (!basketResult.success) {
                    onError(basketResult?.responseData?.errors);
                } else {
                    let err1: boolean = false;
                    let err2: boolean = false;
                    if (voucherData?.bonusItems.length > 0) {
                        basketResult.responseData.data.bonusProducts.some((prod) => {
                            if (!voucherData?.bonusItems.some((e) => e.productId === prod.id)) {
                                err1 = true;
                                return true;
                            }
                        });

                        voucherData?.bonusItems.some((e) => {
                            if (
                                !basketResult.responseData.data.bonusProducts.some(
                                    (prod) => e.productId === prod.id
                                )
                            ) {
                                err2 = true;
                                return true;
                            }
                        });
                    }

                    if (err1 || err2) {
                        onMess("Đã loại bỏ một số quà tặng đã hết hàng ra khỏi giỏ hàng của bạn");
                    }
                    handleApiResponse(result, onCompleted, onError);
                }
            } else {
                onError(result?.responseData?.errors);
            }
        } else {
            onError(result?.responseData?.errors);
        }
    } catch (error) {
        onError(error);
    } finally {
        yield put(loadingActions.finishLoading(PROMOTION_CHECK));
    }
}

function* deleteVoucher({ payload }: RequestApi<any>): any {
    const { baskets, onCompleted, onError } = payload;
    try {
        const options = {
            ...apiConfig.basket.updateBasket,
            path: `${apiConfig.basket.updateBasket.path}/${baskets.basketId}`,
        };

        const basketsBody = {
            ...baskets,
            voucher: null,
            bonusProducts: [...baskets.bonusProducts.filter((e) => e.promotion !== null)],
        };
        const result = yield call(sendRequest, options, basketsBody);
        handleApiResponse(result, onCompleted, onError);
    } catch (error) {
        onError(error);
    }
}

const getListVoucher = ({ payload }: RequestApi<any>) => {
    return processCallbackAction(apiConfig.promotion.getCoupon, payload);
};

export default [
    takeLatest(PROMOTION_CHECK, checkPromotions),
    takeLatest(GET_LIST_VOUCHER, getListVoucher),
    takeLatest(GET_LIST_PROMOTION, getAllPromotion),
    takeLatest(DELETE_VOUCHER, deleteVoucher),
];
