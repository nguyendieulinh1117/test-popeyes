import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { toast } from "react-toastify";

import CachedImage from "@@@CachedImage";
import { formatPrice, getProductDetailUrl, removeDuplicateArrayOfObject } from "@utils";
import { getStringData, removeItem, setStringData } from "@utils/localStorage";
import { paths, storageKeys } from "@constants";
import { useDispatch } from "react-redux";
import { basketActions, promotionActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { handleUpdateItemBasket } from "@utils/basket";

import IconHeart from "@assets/icons/heart.svg";
import IconAdd2Card from "@assets/icons/add-to-cart.svg";
import styles from "./index.module.scss";
import useAuth from "@hooks/useAuth";
import { renderDiscount } from "@utils/discount";
import moment from "moment";
import { setObjectData, setStringData as setStringDataSession } from "@utils/sessionStorage";
import { listErrorCodeVoucher } from "@constants/enum";
import { addToCartFunc } from "@utils/measureEcommerceGA";
declare global{
    interface Window{
        dataLayer: any
    }
}
const ProductItem = ({
    data,
    className,
    isLike = false,
    isOption = true,
    isCollection = false,
    promotionCollection,
}: any) => {
    const dispatch = useDispatch();
    const sku = data?.sku;
    const options = [];
    const quantity = 1;
    const { basketData } = useSelectorTyped((state) => state.basket);
    const [discount, setDiscount] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);

    const { user } = useAuth();

    const flashDeal = {
        currentTime: moment(),
        startTimeFlashDeal: moment(data?.promotion?.from),
        endTimeFlashDeal: moment(data?.promotion?.to),
    };

    const getBaskets = (id: string, baskets?: any) => {
        if (baskets.voucher !== null) {
            dispatch(
                promotionActions.checkPromotion({
                    actionrequest: {
                        params: {
                            code: baskets?.voucher?.code,
                            basketId: baskets?.basketId,
                            phoneNumber: user?.phone || null,
                        },
                        baskets: baskets,
                    },
                    onCompleted: (res: any) => {
                        setObjectData(storageKeys.PROMOTION, res?.data);
                        setStringDataSession(storageKeys.PROMOTION_ERROR, "");
                        setStringDataSession(
                            storageKeys.PROMOTION_SUCCESS,
                            "Áp dụng voucher thành công"
                        );
                        dispatch(basketActions.getBasket(id));
                        dispatch(basketActions.checkStockBasket(id));
                    },
                    onError: (err) => {
                        setObjectData(storageKeys.PROMOTION, {});
                        if (err.length > 0) {
                            setStringDataSession(
                                storageKeys.PROMOTION_ERROR,
                                listErrorCodeVoucher[err[0].code] || "Không thể áp dụng voucher"
                            );
                        } else {
                            setStringDataSession(
                                storageKeys.PROMOTION_ERROR,
                                "Không thể áp dụng voucher"
                            );
                        }
                        setStringDataSession(storageKeys.PROMOTION_SUCCESS, "");
                        dispatch(
                            basketActions.updateBasket({
                                id: baskets?.basketId,
                                params: {
                                    ...baskets,
                                    voucher: null,
                                },
                                onCompleted: (res: any) => {
                                    if (res.success) {
                                        dispatch(basketActions.getBasket(id));
                                        dispatch(basketActions.checkStockBasket(id));
                                    }
                                },
                                onError: (err: any) => {
                                    toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                                    dispatch(
                                        basketActions.deleteBasket({
                                            params: { id: baskets?.basketId },
                                            onCompleted: (res: any) => {
                                                removeItem(storageKeys.BASKET_ID);
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 300);
                                            },
                                            onError: (err: any) => {},
                                        })
                                    );
                                },
                            })
                        );
                    },
                    onMess: (message: string) => {},
                })
            );
        } else {
            dispatch(basketActions.getBasket(id));
            dispatch(basketActions.checkStockBasket(id));
        }
    };

    const createBasket = (onCompleted: any) => {
        const body = {
            products: [
                {
                    id: data?.id,
                    slug: data?.slug,
                    name: data?.name,
                    imageUrl: data?.images[0]?.imageUrl,
                    quantity: 1,
                    discount: data?.discount,
                    price: data?.salePrice,
                    sku: sku,
                    options: options,
                    promotion: data?.promotion,
                },
            ],
            bonusProducts: [],
            voucher: null,
            delivery: {
                amount: 0,
                discount: 0,
            },
        };
        dispatch(
            basketActions.createBasket({
                params: body,
                onCompleted,
                onError: onErrorCreate,
            })
        );
    };

    const handleCart = (onCompletedCreate: any, onCompletedUpdate: any) => {
        if (getStringData(storageKeys.BASKET_ID)) {
            const { body } = handleUpdateItemBasket(
                basketData,
                data,
                options,
                true,
                {
                    data: {
                        ...data,
                    },
                    sku,
                    quantity,
                },
                null
            );
            dispatch(
                basketActions.updateBasket({
                    id: getStringData(storageKeys.BASKET_ID),
                    params: body,
                    onCompleted: onCompletedUpdate,
                    onError: (err: any) => {
                        toast.error("Đang xảy ra lỗi! Giỏ hàng không tồn tại");
                        dispatch(
                            basketActions.deleteBasket({
                                params: { id: getStringData(storageKeys.BASKET_ID) },
                                onCompleted: (res: any) => {
                                    removeItem(storageKeys.BASKET_ID);
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 300);
                                },
                                onError: (err: any) => {},
                            })
                        );
                    },
                })
            );
        } else {
            createBasket(onCompletedCreate);
        }
    };

    const onCompletedCreate = (res: any) => {
        if (res.success) {
            toast.success("Thêm vào giỏ hàng thành công");
            setStringData(storageKeys.BASKET_ID, res.data.basketId);
            getBaskets(res.data.basketId, res.data);

            //ga
            addToCartFunc(res.data)
            
        }
    };

    const onCompletedUpdate = (res: any) => {
        if (res.success) {
            toast.success("Thêm vào giỏ hàng thành công");
            getBaskets(res.data.basketId, res.data);
            
            //ga
            addToCartFunc(res.data)
    
        }
    };

    const onErrorCreate = (err: any) => {
        toast.error("Thêm vào giỏ hàng thất bại");
    };

    useEffect(() => {
        if (data) {
            if (isCollection) {
                if (promotionCollection) {
                    let dis = renderDiscount(
                        data?.salePrice,
                        promotionCollection?.discount,
                        promotionCollection?.maxDiscount,
                        promotionCollection?.discountPercentage,
                        promotionCollection?.fixedPrice
                    );
                    let perDis = Math.round((dis / data.salePrice) * 100);
                    setDiscount(perDis);
                    setTotalDiscount(dis);
                } else {
                    let dis = Math.round((data.discount / data.salePrice) * 100);
                    setDiscount(dis);
                    setTotalDiscount(data.discount);
                }
            } else {
                if (
                    data?.promotion &&
                    flashDeal?.currentTime > flashDeal?.startTimeFlashDeal &&
                    flashDeal?.currentTime < flashDeal?.endTimeFlashDeal
                ) {
                    let dis = renderDiscount(
                        data?.salePrice,
                        data?.promotion?.discount,
                        data?.promotion?.maxDiscount,
                        data?.promotion?.discountPercentage,
                        data?.promotion?.fixedPrice
                    );
                    let perDis = Math.round((dis / data.salePrice) * 100);
                    setDiscount(perDis);
                    setTotalDiscount(dis);
                } else {
                    let dis = Math.round((data.discount / data.salePrice) * 100);
                    setDiscount(dis);
                    setTotalDiscount(data.discount);
                }
            }
        }
    }, [data]);

    const [isColor, setIsColor] = useState<string>("");
    const [imageOption, setImageOption] = useState<string>("");

    return (
        <div
            className={classNames(styles.productCol, className, {
                [styles.outStock]: !data?.inStock,
            })}
        >
            {data?.inStock ? (
                discount > 0 && <div className={styles.discount}>-{discount}%</div>
            ) : (
                <div className={styles.stockNull}>Hết hàng</div>
            )}
            <div className={styles.productItem}>
                <div className={styles.img}>
                    <Link href={getProductDetailUrl(data?.slug)} passHref>
                        <figure>
                            {imageOption !== "" && imageOption !== null && (
                                <CachedImage src={imageOption} alt={data?.slug} />
                            )}
                            {(imageOption === "" || imageOption === null) && (
                                <CachedImage
                                    src={data?.images?.filter((e: any) => e.isDefault)[0]?.imageUrl}
                                    alt={data?.slug}
                                />
                            )}
                            {isLike && (
                                <figcaption className={styles.like}>
                                    <IconHeart />
                                </figcaption>
                            )}
                        </figure>
                    </Link>
                    {data?.optionColors?.length === 0 && data?.inStock && (
                        <button
                            type="button"
                            className={styles.addToCard}
                            onClick={() => handleCart(onCompletedCreate, onCompletedUpdate)}
                        >
                            <IconAdd2Card />
                        </button>
                    )}
                </div>
                {data?.optionColors?.length > 0 && (
                    <div className={styles.optionWrap}>
                        <ul className={styles.option}>
                            {data?.optionColors
                                ?.filter(
                                    (e) =>
                                        e?.images !== null &&
                                        e.images?.filter(
                                            (e) => e.imageUrl !== null && e.imageUrl !== ""
                                        )?.length > 0
                                )
                                ?.map((value: any, key: number) => (
                                    <li
                                        key={key}
                                        className={classNames({
                                            [styles.active]: isColor === `${data.id} - ${value.id}`,
                                        })}
                                        onClick={() => {
                                            if (isColor === `${data.id} - ${value.id}`) {
                                                setIsColor("");
                                                setImageOption("");
                                            } else {
                                                setIsColor(`${data.id} - ${value.id}`);
                                                if (
                                                    value.images !== null &&
                                                    value.images.length > 0
                                                ) {
                                                    setImageOption(
                                                        value.images.filter(
                                                            (e) =>
                                                                e.imageUrl !== "" &&
                                                                e.imageUrl !== null
                                                        )[0].imageUrl
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        {value?.images !== null &&
                                        value?.images?.length > 0 &&
                                        value?.images?.some(
                                            (e) => e.imageUrl !== "" && e.imageUrl !== null
                                        ) ? (
                                            <span
                                                style={{
                                                    backgroundImage: `url(${
                                                        value?.images?.find(
                                                            (e) =>
                                                                e.imageUrl !== "" &&
                                                                e.imageUrl !== null
                                                        )?.imageUrl
                                                    })`,
                                                    backgroundPosition: "center",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundSize: "cover",
                                                }}
                                            ></span>
                                        ) : (
                                            <span style={{ background: value?.fieldData }} />
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
                <div className={styles.text}>
                    <Link href={getProductDetailUrl(data?.slug)} passHref>
                        <div className={styles.tooltips} data-tool-tip={data?.name}>
                            <h3>{data?.name}</h3>
                        </div>
                    </Link>
                    {totalDiscount > 0 ? (
                        <p className={styles.dis}>
                            {formatPrice(data?.salePrice - totalDiscount || 0)}{" "}
                            <del>{formatPrice(data?.salePrice || 0)}</del>
                        </p>
                    ) : (
                        <p>{formatPrice(data?.salePrice || 0)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
