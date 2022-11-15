import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import * as Scroll from "react-scroll";

import CachedImage from "@@@CachedImage";
import BasicForm from "@@@Form/BasicForm";
import Button from "@@@Form/Button";
import RadioButtonField from "@@@Form/RadioButtonField";
import Quantity from "@@@Quantity";
import { Desktop, Mobile } from "@@@Media";
import useDevices from "@hooks/useDevices";
import ProductPolicy from "./ProductPolicy";
import BasicModal from "@@@Modal";

import IconCart from "@assets/icons/cart.svg";
import IconAddCart from "@assets/icons/add-to-cart.svg";
import IconFlashSale from "@assets/icons/flash-sale.svg";
import IconDiscount from "@assets/icons/discount.svg";
import IconGift from "@assets/icons/gift.svg";
import IconLocation from "@assets/icons/location-full.svg";
import IconResult from "@assets/icons/result.svg";
import IconChecked from "@assets/icons/checked.svg";
import IconArrow from "@assets/icons/arrow-right.svg";

import styles from "./ProductInfo.module.scss";
import { formatPrice, isEmptyObject } from "@utils";
import { getStringData, removeItem, setStringData } from "@utils/localStorage";
import { paths, storageKeys } from "@constants";
import { useDispatch } from "react-redux";
import { basketActions, productActions, promotionActions } from "@redux/actions";
import { useSelectorTyped } from "@hooks/useSelectorType";
import { handleAddCombo, handleUpdateItemBasket } from "@utils/basket";
import { EnumGroupOptionsProduct, listErrorCodeVoucher } from "@constants/enum";
import CountDown from "@@CountDown";

import CompactContent from "@@@CompactContent";
import ComboModal from "./ComboModal";
import useAuth from "@hooks/useAuth";
import { renderDiscount } from "@utils/discount";
import { setObjectData, setStringData as setStringDataSession } from "@utils/sessionStorage";
import { addToCartFunc } from "@utils/measureEcommerceGA";

const ProductInfo = ({ data, storeStocks, setImageOptionColor, imageOptionColor }: any) => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [isColor, setIsColor] = useState<string>("");
    const [isSize, setIsSize] = useState<string>("");
    const [isShowSize, setIsShowSize] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const { isMobile } = useDevices();
    const [options, setOptions] = useState<Array<any>>([]);
    const [mappings, setMappings] = useState<Array<number>>([]);
    const [change, setChange] = useState<boolean>(false);
    const [sku, setSku] = useState<any>(null);
    const [optionRequired, setOptionRequired] = useState<Array<number>>([]);
    const [combos, setCombos] = useState<Array<any>>([]);
    const [promotion, setPromotion] = useState<any>();
    const formRefCombo = useRef<any>(null);
    const [storeCount, setStoreCount] = useState(0);
    const [changeCombo, setChangeCombo] = useState<boolean>(false);
    const [comboModal, setComboModal] = useState<boolean>(false);
    const [comboModalData, setComboModalData] = useState<any>(false);
    const [dataCombo, setDataCombo] = useState<Array<any>>([]);
    const { basketData } = useSelectorTyped((state) => state.basket);
    const promotionCombo = data?.promotion?.bonusItems;
    const [remainCount, setRemainCount] = useState(0);
    const [arrStock, setArrStock] = useState<Array<any>>([]);
    const [arrOptionIds, setArrOptionIds] = useState<Array<number>>([]);
    const [showVoucher, setShowVoucher] = useState<boolean>(false);
    const flashDeal = {
        currentTime: moment(),
        startTimeFlashDeal: moment(data?.promotion?.from),
        endTimeFlashDeal: moment(data?.promotion?.to),
    };
    const onUpdateQuantity = (value: number) => {
        setQuantity(value);
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
                            setStringData(
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

    const handleChangeOption = (option: any, optionGroupId: number, optionGroupType: string) => {
        setChange(true);
        let findOption = options.find((e: any) => e.id === option.id);

        if (findOption) {
            let optionsOld = options.filter((e: any) => e.id !== option.id);
            let map: number[] = [];
            let optionArr = [...optionsOld];
            optionArr.forEach((e) => {
                map.push(e.id);
            });
            let opttionColors = optionArr.filter(
                (e: any) => e.groupType === EnumGroupOptionsProduct.COLOR
            );
            let optionSizes = optionArr.filter(
                (e: any) => e.groupType === EnumGroupOptionsProduct.SIZE
            );
            setOptions([...opttionColors, ...optionSizes]);
            setMappings(map);
            let skuTemp;
            setSku(data?.sku);
            setImageOptionColor("");
            data?.mappings?.map((e: any) => {
                let a = JSON.stringify(e.uniqueOptionIds.sort((a: number, b: number) => a - b));
                let b = JSON.stringify(map.sort((a: number, b: number) => a - b));
                if (a == b) {
                    setSku(e?.sku);
                    setImageOptionColor(e?.imageUrl);
                    skuTemp = e;
                }
            });

            let findSku = data.stocks?.find((item) => item.sku === skuTemp?.sku);

            if (findSku) {
                setRemainCount(findSku.quantity);
            } else {
                setRemainCount(0);
            }
        } else {
            let optionsOld = options.filter((e: any) => e.groupId !== optionGroupId);
            let map: number[] = [];
            let optionArr = [
                ...optionsOld,
                {
                    id: option.id,
                    name: option.name,
                    additionalPrice: option.additionalPrice,
                    discount: option.discount,
                    description: option.description,
                    groupId: optionGroupId,
                    groupType: optionGroupType,
                },
            ];
            optionArr.forEach((e) => {
                map.push(e.id);
            });
            let opttionColors = optionArr.filter(
                (e: any) => e.groupType === EnumGroupOptionsProduct.COLOR
            );
            let optionSizes = optionArr.filter(
                (e: any) => e.groupType === EnumGroupOptionsProduct.SIZE
            );
            setOptions([...opttionColors, ...optionSizes]);
            setMappings(map);
            setSku(data?.sku);
            setImageOptionColor("");
            let skuTemp;
            data?.mappings?.map((e: any) => {
                let a = JSON.stringify(e.uniqueOptionIds.sort((a: number, b: number) => a - b));
                let b = JSON.stringify(map.sort((a: number, b: number) => a - b));
                if (a == b) {
                    setSku(e?.sku);
                    setImageOptionColor(e?.imageUrl);
                    skuTemp = e;
                }
            });
            let findSku = data.stocks?.find((item) => item.sku === skuTemp.sku);

            if (findSku) {
                setRemainCount(findSku.quantity);
            } else {
                setRemainCount(0);
            }
        }
    };

    const handleMergeCB = (combos: any, quantity: number) => {
        let tempQty = quantity;

        const comboArr = combos.filter(
            (e) => tempQty >= e.items.reduce((prev, curr) => prev + curr.quantity, 0)
        );
        let arr: any[] = [];
        if (comboArr.length > 0) {
            arr.push({
                name: comboArr[0].name,
                quantity: 1,
                salePrice: comboArr[0].price,
                code: comboArr[0].code,
                products: [
                    {
                        id: data?.id,
                        slug: data?.slug,
                        name: data?.name,
                        imageUrl:
                            imageOptionColor !== "" && imageOptionColor !== null
                                ? imageOptionColor
                                : data?.images[0]?.imageUrl,
                        quantity: comboArr[0].items.reduce((prev, curr) => prev + curr.quantity, 0),
                        discount: data?.discount,
                        price: data?.salePrice,
                        sku: data?.optionGroups?.length > 0 ? sku : data?.sku,
                        options: options,
                        promotion: data?.promotion,
                    },
                ],
            });
            tempQty = tempQty - comboArr[0].items.reduce((prev, curr) => prev + curr.quantity, 0);

            return [...arr, ...handleMergeCB(combos, tempQty)];
        } else {
            return arr;
        }
    };

    const countProd = (combos: any, quantity: number) => {
        let tempQty = quantity;

        const comboArr = combos.filter(
            (e) => tempQty >= e.items.reduce((prev, curr) => prev + curr.quantity, 0)
        );

        if (comboArr.length > 0) {
            tempQty = tempQty - comboArr[0].items.reduce((prev, curr) => prev + curr.quantity, 0);
            if (tempQty > 0) {
                return countProd(combos, tempQty);
            } else {
                return countProd(combos, 0);
            }
        } else {
            return tempQty;
        }
    };

    const createBasket = (onCompleted: any) => {
        const a = promotion;
        let body;

        if (data.combos.length > 0) {
            const comboArr = data.combos.filter((e) =>
                e.items.every((i) => i.productId === data?.id && quantity >= i.quantity)
            );
            const count = countProd(
                comboArr.sort(
                    (a, b) =>
                        b.items.reduce((prev, curr) => prev + curr.quantity, 0) -
                        a.items.reduce((prev, curr) => prev + curr.quantity, 0)
                ),
                quantity
            );
            if (count > 0) {
                body = {
                    products: [
                        {
                            id: data?.id,
                            slug: data?.slug,
                            name: data?.name,
                            imageUrl:
                                imageOptionColor !== "" && imageOptionColor !== null
                                    ? imageOptionColor
                                    : data?.images[0]?.imageUrl,
                            quantity: count,
                            discount: data?.discount,
                            price: data?.salePrice,
                            sku: data?.optionGroups?.length > 0 ? sku : data?.sku,
                            options: options,
                            promotion: data?.promotion,
                        },
                    ],
                    bonusProducts: promotion
                        ? [{ ...a, quantity: promotion.quantity * quantity }]
                        : [],
                    voucher: null,
                    delivery: {
                        amount: 0,
                        discount: 0,
                    },
                    combos: handleMergeCB(
                        comboArr.sort(
                            (a, b) =>
                                b.items.reduce((prev, curr) => prev + curr.quantity, 0) -
                                a.items.reduce((prev, curr) => prev + curr.quantity, 0)
                        ),
                        quantity
                    ),
                };
            } else {
                body = {
                    products: [],
                    bonusProducts: [],
                    voucher: null,
                    delivery: {
                        amount: 0,
                        discount: 0,
                    },
                    combos: handleMergeCB(
                        comboArr.sort(
                            (a, b) =>
                                b.items.reduce((prev, curr) => prev + curr.quantity, 0) -
                                a.items.reduce((prev, curr) => prev + curr.quantity, 0)
                        ),
                        quantity
                    ),
                };
            }
        } else {
            body = {
                products: [
                    {
                        id: data?.id,
                        slug: data?.slug,
                        name: data?.name,
                        imageUrl:
                            imageOptionColor !== "" && imageOptionColor !== null
                                ? imageOptionColor
                                : data?.images[0]?.imageUrl,
                        quantity: quantity,
                        discount: data?.discount,
                        price: data?.salePrice,
                        sku: data?.optionGroups?.length > 0 ? sku : data?.sku,
                        options: options,
                        promotion: data?.promotion,
                    },
                ],
                bonusProducts: promotion ? [{ ...a, quantity: promotion.quantity * quantity }] : [],
                voucher: null,
                delivery: {
                    amount: 0,
                    discount: 0,
                },
            };
        }

        dispatch(
            basketActions.createBasket({
                params: body,
                onCompleted,
                onError: onErrorCreate,
            })
        );
    };

    const handleCart = (onCompletedCreate: any, onCompletedUpdate: any) => {
        let err: boolean = false;
        optionRequired.some((e) => {
            if (!options.some((opt) => opt.groupId === e)) {
                err = true;
                return true;
            }
        });
        if (err) {
            toast.warn("Vui lòng chọn đủ tùy chọn để tiếp tục mua hàng");
        } else {
            if (getStringData(storageKeys.BASKET_ID)) {
                const { body } = handleUpdateItemBasket(
                    basketData,
                    data,
                    options,
                    true,

                    {
                        data: {
                            ...data,
                            images:
                                imageOptionColor !== null && imageOptionColor !== ""
                                    ? [{ imageUrl: imageOptionColor }]
                                    : data?.images,
                        },
                        sku,
                        quantity,
                    },
                    promotion ? { ...promotion, quantity: promotion?.quantity * quantity } : null
                );
                // console.log(body);
                dispatch(
                    basketActions.updateBasket({
                        id: getStringData(storageKeys.BASKET_ID),
                        params: body,
                        onCompleted: onCompletedUpdate,
                        onError: (err) => {
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
    const onCompletedCreateBuyNow = (res: any) => {
        if (res.success) {
            setStringData(storageKeys.BASKET_ID, res.data.basketId);

            //ga
            addToCartFunc(res.data)
    
            window.location.assign(paths.checkout);
        }
    };
    const onCompletedUpdateBuyNow = (res: any) => {
        if (res.success) {

            //ga
            addToCartFunc(res.data)
            
            window.location.assign(paths.checkout);
        }
    };
    const onErrorCreate = (err: any) => {
        toast.error(err.errors[0].message);
    };

    const onCompletedUpdate = (res: any) => {
        if (res.success) {
            toast.success("Thêm vào giỏ hàng thành công");
            getBaskets(res.data.basketId, res.data);

            //ga
            addToCartFunc(res.data)
        }
    };

    useEffect(() => {
        if (!change) {
            let remain = 0;
            let arrStocks: any[] = [];
            let optionRequireds: any[] = [];
            let arrOptIds: any[] = [];
            let arrMappingStock: any[] = [];
            data?.stocks?.forEach((e) => {
                remain = remain + e.quantity;
                if (e.quantity > 0) {
                    arrStocks.push(e);
                    setArrStock(arrStocks);
                }
            });

            const colorOptions = data?.optionGroups?.find(
                (option) =>
                    option?.groupType?.toLowerCase() === EnumGroupOptionsProduct.COLOR.toLowerCase()
            );
            const sizeOptions = data?.optionGroups?.find(
                (option) =>
                    option?.groupType?.toLowerCase() === EnumGroupOptionsProduct.SIZE.toLowerCase()
            );
            const tempColors = data?.optionColors?.filter(
                (e) =>
                    e?.images !== null &&
                    e.images?.filter((e) => e.imageUrl !== null && e.imageUrl !== "")?.length > 0
            );
            data?.mappings
                ?.filter((e) => e.uniqueOptionIds.some((id) => tempColors.some((o) => id === o.id)))
                ?.map((e) => {
                    arrStocks.map((stock) => {
                        if (stock?.sku === e?.sku) {
                            arrMappingStock.push(stock);
                            e?.uniqueOptionIds.forEach((id) => {
                                if (!arrOptIds.some((i) => i === id)) {
                                    arrOptIds.push(id);
                                    setArrOptionIds(arrOptIds);
                                }
                            });
                        }
                    });
                });
            data?.optionGroups?.map((option: any) => {
                if (option?.required) {
                    optionRequireds.push(option?.id);
                    setOptionRequired(optionRequireds);
                }
            });

            if (arrStocks.length > 0) {
                if (arrMappingStock.length > 0) {
                    let map = data?.mappings.find((e) => e.sku === arrMappingStock[0].sku);
                    if (map) {
                        let otpColor = data?.optionColors?.find((e) =>
                            map?.uniqueOptionIds?.some((m) => m === e.id)
                        );
                        let otpSize = sizeOptions?.options?.find((e) =>
                            map?.uniqueOptionIds?.some((m) => m === e.id)
                        );
                        setIsColor(otpColor?.name);
                        setIsSize(otpSize?.name);
                        setOptions([
                            {
                                id: otpColor?.id,
                                name: otpColor?.name,
                                additionalPrice: otpColor?.additionalPrice,
                                discount: otpColor?.discount,
                                description: otpColor?.description,
                                groupId: colorOptions?.id,
                                groupType: colorOptions?.groupType,
                            },
                            {
                                id: otpSize?.id,
                                name: otpSize?.name,
                                additionalPrice: otpSize?.additionalPrice,
                                discount: otpSize?.discount,
                                description: otpSize?.description,
                                groupId: sizeOptions?.id,
                                groupType: sizeOptions?.groupType,
                            },
                        ]);
                        setMappings(map?.uniqueOptionIds);
                        setSku(arrMappingStock[0].sku);
                        setRemainCount(arrMappingStock[0].quantity);
                        // setImageOptionColor(map?.imageUrl);
                    }
                } else {
                    if (optionRequireds.length < 1) {
                        setSku(arrStocks[0].sku);
                        setRemainCount(arrStocks[0].quantity);
                        setImageOptionColor("");
                    }
                }
            } else {
                setRemainCount(0);
                setImageOptionColor("");
            }
        }
    }, [data, change]);

    const [countdown, setCountdown] = useState({});

    const changeComboPromotion = (e, item) => {
        if (formRefCombo.current) {
            formRefCombo.current.setValues({ combo: `${e.target.value}` });
        }
        const stockArr = item.product.stocks.filter(
            (e: any) => e.quantity >= item.quantity * quantity
        );
        let skuBonus = stockArr[Math.floor(Math.random() * stockArr.length)];

        const mappingsBonus = item.product.mappings.find((e: any) => e.sku === skuBonus.sku);

        let opt: any[] = [];
        if (mappingsBonus) {
            mappingsBonus.uniqueOptionIds.forEach((element) => {
                opt.push({
                    id: element,
                });
            });
        }

        setPromotion({
            id: item.productId,
            slug: item.product.slug,
            name: item.product.name,
            imageUrl: item.product.images[0].imageUrl,
            quantity: item.quantity,
            discount: item.product.discount,
            price: item.product.salePrice,
            promotion: data?.promotion,
            sku: skuBonus.sku,
            options: opt,
        });
    };

    const renderPrice = useMemo(() => {
        let salePrice = data?.salePrice;
        let discount = data?.discount;
        if (
            data?.promotion &&
            flashDeal?.currentTime > flashDeal?.startTimeFlashDeal &&
            flashDeal?.currentTime < flashDeal?.endTimeFlashDeal
        ) {
            let dis = renderDiscount(
                salePrice,
                data?.promotion?.discount,
                data?.promotion?.maxDiscount,
                data?.promotion?.discountPercentage,
                data?.promotion?.fixedPrice
            );
            let perDis = Math.round((dis / salePrice) * 100);
            return (
                <>
                    <p>
                        {formatPrice(salePrice - dis || 0)}
                        <del>{formatPrice(salePrice || 0)}</del>
                    </p>
                    <span>{`-${perDis}%`}</span>
                </>
            );
        } else {
            if (discount !== 0) {
                let perDis = Math.round((discount / salePrice) * 100);
                return (
                    <>
                        <p>
                            {formatPrice(salePrice - discount || 0)}
                            <del>{formatPrice(salePrice || 0)}</del>
                        </p>
                        <span>{`-${perDis}%`}</span>
                    </>
                );
            } else {
                return (
                    <>
                        <p>{formatPrice(salePrice || 0)}</p>
                    </>
                );
            }
        }
    }, [data]);

    useEffect(() => {
        if (storeStocks?.length > 0) {
            let count = 0;
            storeStocks?.forEach((stock) => {
                stock?.districts?.forEach((dis) => {
                    count = count + (dis.stores?.length || 0);
                });
            });
            setStoreCount(count);
        }
    }, [storeStocks]);

    const onOpenModalCombo = (combo) => {
        dispatch(
            productActions.getComboDetail({
                params: {
                    id: combo.code,
                },
                onCompleted: (res) => {
                    setComboModalData(res.data);
                    setComboModal(true);
                },
                onError: (err) => {},
            })
        );
    };

    const onCloseModalCombo = () => {
        setDataCombo([]);
        setComboModal(false);
        setChangeCombo(false);
    };

    const onConfirmModalCombo = (combo) => {
        setComboModal(false);
        setComboModalData(null);
        setChangeCombo(false);
        let listProduct = combo.data.map((item) => {
            let options: any[] = [];
            if (!isEmptyObject(item.optionColor)) {
                options.push(item.optionColor);
            }
            if (!isEmptyObject(item.optionSize)) {
                options.push(item.optionSize);
            }
            return {
                id: item.product.id,
                slug: item.product.slug,
                name: item.product.name,
                imageUrl: item.product.images[0].imageUrl,
                quantity: item.quantity,
                discount: item.product.discount,
                price: item.product.salePrice,
                promotion: item.product.promotion,
                sku: item.sku,
                options: options,
            };
        });
        if (getStringData(storageKeys.BASKET_ID)) {
            const { body } = handleAddCombo(basketData, combo, listProduct);
            const comboList: any[] = [...body.combos];
            const comboFilter: any[] = comboList.filter((e: any) => e.code === combo.code);
            if (comboFilter.length <= combo.maxQty) {
                dispatch(
                    basketActions.updateBasket({
                        id: getStringData(storageKeys.BASKET_ID),
                        params: body,
                        onCompleted: onCompletedUpdate,
                        onError: (err) => {
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
                toast.error(`Chỉ được phép thêm tối đa ${combo.maxQty} combo vào giỏ hàng`);
            }
        } else {
            const body = {
                products: [],
                bonusProducts: [],
                voucher: null,
                delivery: {
                    amount: 0,
                    discount: 0,
                },
                combos: [
                    {
                        name: combo.name,
                        quantity: combo.quantity,
                        salePrice: combo.salePrice,
                        code: combo.code,
                        products: listProduct,
                    },
                ],
            };
            dispatch(
                basketActions.createBasket({
                    params: body,
                    onCompleted: onCompletedCreate,
                    onError: onErrorCreate,
                })
            );
        }
    };

    return (
        <div className={styles.productInfo}>
            <div className={styles.title}>
                <h3>{data?.name}</h3>
            </div>
            {data?.promotion &&
                flashDeal?.currentTime > flashDeal?.startTimeFlashDeal &&
                flashDeal?.currentTime < flashDeal?.endTimeFlashDeal && (
                    <div className={styles.flashSale}>
                        <p>
                            <IconFlashSale />
                            <Desktop>
                                <span>KẾT THÚC TRONG</span>
                                <CountDown countDownTime={flashDeal?.endTimeFlashDeal} />
                            </Desktop>
                        </p>
                    </div>
                )}
            <div className={styles.price}>{renderPrice}</div>
            {promotionCombo?.length > 0 &&
                flashDeal?.currentTime > flashDeal?.startTimeFlashDeal &&
                flashDeal?.currentTime < flashDeal?.endTimeFlashDeal && (
                    <>
                        {data?.promotion?.description && (
                            <div className={styles.promotionDescription}>
                                {data?.promotion?.description}
                            </div>
                        )}
                        <div className={styles.combo}>
                            {/* <label>
                            <IconGift />
                            <span>Quà tặng: COMBO 02 dây cột tóc (SL có hạn)</span>
                        </label> */}
                            <BasicForm
                                formikRef={formRefCombo}
                                initialValues={{
                                    combo: "",
                                }}
                            >
                                {promotionCombo?.map((item: any, index: number) => (
                                    <div key={index}>
                                        <RadioButtonField
                                            onClick={(e) => changeComboPromotion(e, item)}
                                            className={styles.radio}
                                            name="combo"
                                            value={`${item.productId}`}
                                        >
                                            <figure>
                                                <CachedImage
                                                    src={item.product?.images[0].imageUrl}
                                                    alt="gift"
                                                    width="46px"
                                                />
                                            </figure>
                                            <h3>
                                                {item.product?.name}
                                                <p>
                                                    Trị giá:{" "}
                                                    <span>
                                                        {formatPrice(item?.product?.salePrice || 0)}
                                                    </span>
                                                </p>
                                            </h3>
                                        </RadioButtonField>
                                    </div>
                                ))}
                            </BasicForm>
                        </div>
                    </>
                )}
            {/* <div className={styles.voucher}>
                <label>Mã giảm giá:</label>
                <div
                    className={styles.wrapList}
                    onClick={() => {
                        setShowVoucher(true);
                        document.body.style.overflow = "hidden";
                        document.body.style.touchAction = "none";
                    }}
                >
                    <div className={styles.list}>
                        <ul>
                            <li>Giảm 40K</li>
                            <li>Giảm 50K</li>
                            <li>Giảm 9K</li>
                            <li>Giảm 10%</li>
                            <li>Giảm 9K</li>
                            <li>Giảm 10%</li>
                            <li>Giảm 9K</li>
                            <li>Giảm 10%</li>
                        </ul>
                        <div className={styles.mask}></div>
                    </div>
                    <Mobile>
                        <IconArrow />
                    </Mobile>
                </div>
                <Desktop>
                    <div className={styles.voucherDetail}>
                        <h3>Chi tiết mã giảm giá</h3>
                        <p className={styles.voucherDes}>
                            Mã giảm giá sẽ tự động áp dụng khi đơn hàng của bạn đạt giá trị tối
                            thiểu.
                        </p>
                        <div className={styles.listVoucher}>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                            <div className={styles.voucherItem}>
                                <h4 className={styles.name}>
                                    Giảm 40K <span>(Còn 246)</span>
                                </h4>
                                <p className={styles.voucherDescription}>
                                    Đơn tối thiểu 399K giảm tối đa 20K
                                </p>
                                <p className={styles.expired}>HSD: 31.10.2022</p>
                            </div>
                        </div>
                    </div>
                </Desktop>
                <Mobile>
                    {showVoucher && (
                        <div className={styles.wrapMobile}>
                            <div className={styles.voucherDetailMb}>
                                <h3>Chi tiết mã giảm giá</h3>
                                <p className={styles.voucherDes}>
                                    Mã giảm giá sẽ tự động áp dụng khi đơn hàng của bạn đạt giá trị
                                    tối thiểu.
                                </p>
                                <div className={styles.listVoucher}>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                    <div className={styles.voucherItem}>
                                        <h4 className={styles.name}>
                                            Giảm 40K <span>(Còn 246)</span>
                                        </h4>
                                        <p className={styles.voucherDescription}>
                                            Đơn tối thiểu 399K giảm tối đa 20K
                                        </p>
                                        <p className={styles.expired}>HSD: 31.10.2022</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.wrapBtn}>
                                <Button
                                    className={styles.btn}
                                    buttonStyle="secondary"
                                    onClick={() => {
                                        setShowVoucher(false);
                                        document.body.style.overflow = "auto";
                                        document.body.style.touchAction = "auto";
                                    }}
                                >
                                    Tắt
                                </Button>
                            </div>
                        </div>
                    )}
                    {showVoucher && (
                        <div
                            className={styles.maskBg}
                            onClick={() => {
                                setShowVoucher(false);
                                document.body.style.overflow = "auto";
                                document.body.style.touchAction = "auto";
                            }}
                        ></div>
                    )}
                </Mobile>
            </div> */}
            {data?.optionColors?.filter(
                (e) =>
                    e?.images !== null &&
                    e.images?.filter((e) => e.imageUrl !== null && e.imageUrl !== "")?.length > 0
            )?.length > 0 && (
                <div className={styles.color}>
                    <label>Màu sắc: {isColor !== "" && <span>{isColor}</span>}</label>
                    <ul>
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
                                        [styles.colorActive]: value?.name === isColor,
                                        [styles.disable]: !arrOptionIds.some(
                                            (e) => e === value?.id
                                        ),
                                    })}
                                    onClick={() => {
                                        if (isColor === value?.name) {
                                            setIsColor("");
                                            setImageOptionColor("");
                                        } else {
                                            setIsColor(value?.name);
                                            setImageOptionColor(
                                                value.images !== null && value.images?.length > 0
                                                    ? value.images?.filter(
                                                          (e) =>
                                                              e.imageUrl !== "" &&
                                                              e.imageUrl !== null
                                                      )[0]?.imageUrl
                                                    : ""
                                            );
                                        }

                                        handleChangeOption(
                                            value,
                                            data?.optionGroups?.filter(
                                                (e: any) =>
                                                    e.groupType?.toLowerCase() ===
                                                    EnumGroupOptionsProduct.COLOR.toLowerCase()
                                            )[0]?.id,
                                            data?.optionGroups?.filter(
                                                (e: any) =>
                                                    e.groupType?.toLowerCase() ===
                                                    EnumGroupOptionsProduct.COLOR.toLowerCase()
                                            )[0]?.groupType
                                        );
                                    }}
                                >
                                    {value.images !== null &&
                                    value?.images?.length > 0 &&
                                    value?.images?.some(
                                        (e) => e.imageUrl !== "" && e.imageUrl !== null
                                    ) ? (
                                        <span
                                            style={{
                                                backgroundImage: `url(${
                                                    value?.images?.find(
                                                        (e) =>
                                                            e.imageUrl !== "" && e.imageUrl !== null
                                                    )?.imageUrl
                                                })`,
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "contain",
                                            }}
                                        ></span>
                                    ) : (
                                        <span style={{ background: value?.fieldData }}></span>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {data?.optionGroups?.filter(
                (e: any) => e.groupType.toLowerCase() === EnumGroupOptionsProduct.SIZE.toLowerCase()
            ).length > 0 &&
                data?.optionGroups?.filter(
                    (e: any) =>
                        e.groupType.toLowerCase() === EnumGroupOptionsProduct.SIZE.toLowerCase()
                )[0]?.options.length > 0 && (
                    <div className={styles.size}>
                        <label>Kích cỡ:</label>
                        <ul>
                            {data?.optionGroups
                                ?.filter(
                                    (e: any) =>
                                        e.groupType.toLowerCase() ===
                                        EnumGroupOptionsProduct.SIZE.toLowerCase()
                                )[0]
                                ?.options.map((value: any, key: number) => (
                                    <li
                                        key={key}
                                        className={classNames({
                                            [styles.sizeActive]: value?.name === isSize,
                                            [styles.disable]: !arrOptionIds.some(
                                                (e) => e === value?.id
                                            ),
                                        })}
                                        onClick={() => {
                                            if (isSize === value?.name) {
                                                setIsSize("");
                                            } else {
                                                setIsSize(value?.name);
                                            }

                                            handleChangeOption(
                                                value,
                                                data?.optionGroups?.filter(
                                                    (e: any) =>
                                                        e.groupType?.toLowerCase() ===
                                                        EnumGroupOptionsProduct.SIZE.toLowerCase()
                                                )[0]?.id,
                                                data?.optionGroups?.filter(
                                                    (e: any) =>
                                                        e.groupType?.toLowerCase() ===
                                                        EnumGroupOptionsProduct.SIZE.toLowerCase()
                                                )[0]?.groupType
                                            );
                                        }}
                                    >
                                        {value?.name}
                                    </li>
                                ))}
                        </ul>

                        {data?.sizeGuideImageUrl ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsShowSize(true);
                                        let scroll = Scroll.animateScroll;
                                        scroll.scrollToTop({ smooth: true });
                                    }}
                                >
                                    Hướng dẫn chọn size
                                </button>
                                <BasicModal
                                    isOpen={isShowSize}
                                    onClose={() => setIsShowSize(false)}
                                    contentClass={styles.sizeModalContent}
                                    bodyClass={styles.sizeModalBody}
                                >
                                    <CachedImage src={data?.sizeGuideImageUrl} alt="select size" />
                                </BasicModal>
                            </>
                        ) : undefined}
                    </div>
                )}

            <div className={styles.quantity}>
                <label> Chọn số lượng:</label>
                <div className={styles.input}>
                    <Quantity
                        value={quantity}
                        onUpdate={onUpdateQuantity}
                        quantityAvailable={remainCount}
                    />
                    <span>(Còn: {remainCount} sản phẩm)</span>
                </div>
            </div>
            <div className={styles.action}>
                <div
                    className={classNames(
                        styles.location,
                        { [styles.disable]: data?.stocks?.length < 1 },
                        { [styles.stockNull]: storeStocks?.length < 1 }
                    )}
                >
                    <button type="button">
                        {" "}
                        {data?.stocks?.length < 1 ? (
                            "HẾT HÀNG"
                        ) : (
                            <>
                                <IconLocation />{" "}
                                {storeStocks?.length > 0 ? `${storeCount} cửa hàng` : "Tổng kho"}{" "}
                                <br /> còn sản phẩm{" "}
                            </>
                        )}
                    </button>
                    <div className={styles.storeList}>
                        <ul className={styles.storeProvince}>
                            {storeStocks?.map((value: any, key: number) => {
                                let count = 0;
                                value?.districts?.forEach((dis) => {
                                    count = count + (dis.stores?.length || 0);
                                });

                                return (
                                    <li key={key}>
                                        <a>
                                            {value?.name} ({count})
                                        </a>
                                        {value?.districts?.length > 0 && (
                                            <ul className={styles.storeDistrict}>
                                                {value?.districts?.map(
                                                    (value_list: any, key_list: number) => (
                                                        <li key={key_list}>
                                                            <a>
                                                                {" "}
                                                                <IconChecked /> {
                                                                    value_list?.name
                                                                }{" "}
                                                            </a>
                                                            {value_list?.stores?.length > 0 && (
                                                                <ul className={styles.store}>
                                                                    {value_list?.stores?.map(
                                                                        (
                                                                            value_cat: any,
                                                                            key_cat: number
                                                                        ) => (
                                                                            <li key={key_cat}>
                                                                                <a>
                                                                                    <span>
                                                                                        {" "}
                                                                                        Còn hàng{" "}
                                                                                    </span>{" "}
                                                                                    tại{" "}
                                                                                    {
                                                                                        value_cat?.name
                                                                                    }
                                                                                </a>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>{" "}
                {data?.stocks?.length > 0 && (
                    <>
                        <Button
                            buttonStyle="secondary"
                            onClick={() =>
                                handleCart(onCompletedCreateBuyNow, onCompletedUpdateBuyNow)
                            }
                            className={classNames({ [styles.disableBtn]: remainCount < 1 })}
                        >
                            {" "}
                            MUA NGAY
                        </Button>
                        <Button
                            onClick={() => handleCart(onCompletedCreate, onCompletedUpdate)}
                            className={classNames({ [styles.disableBtn]: remainCount < 1 })}
                        >
                            {isMobile ? <IconAddCart /> : <> THÊM VÀO GIỎ HÀNG </>}
                        </Button>
                    </>
                )}
            </div>
            <Mobile>
                <ProductPolicy className={styles.policyMobile} />
            </Mobile>
            {data?.combos?.length > 0 && data?.stocks?.length > 0 && (
                <div className={styles.discount}>
                    <p>
                        <IconDiscount /> <span>Giá sẽ giảm khi mua combo</span>
                    </p>
                    {data?.combos?.map((combo, index: number) => (
                        <div className={styles.discountBox} key={index}>
                            <div className={styles.listItem}>
                                {combo?.items?.map((item, key) => (
                                    <figure key={key}>
                                        <CachedImage
                                            src={item?.product?.images[0]?.imageUrl || ""}
                                            alt="gift"
                                            width="72px"
                                        />
                                        <figcaption>
                                            {formatPrice(
                                                item?.product?.salePrice - item?.product?.discount
                                            )}{" "}
                                            <br /> x{item.quantity}
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>

                            <div className={styles.addComboToCart}>
                                <div className={styles.result}>
                                    <IconResult />
                                </div>
                                <div className={styles.priceAdd}>
                                    <strong>{formatPrice(combo?.price)}</strong>
                                    <Button
                                        onClick={() => onOpenModalCombo(combo)}
                                        className={styles.discountBtn}
                                    >
                                        {isMobile ? <IconAddCart /> : <>THÊM VÀO </>}
                                        GIỎ HÀNG
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data?.information && (
                <div className={styles.detail}>
                    <h3>Thông tin sản phẩm:</h3>
                    <CompactContent
                        compactHeight={isMobile ? 560 : 700}
                        toggleButtonLabelMore="Xem thêm"
                    >
                        <article dangerouslySetInnerHTML={{ __html: data?.information }} />
                    </CompactContent>
                </div>
            )}
            <ComboModal
                isShow={comboModal}
                onClose={onCloseModalCombo}
                data={comboModalData}
                onConfirm={onConfirmModalCombo}
                dataCombo={dataCombo}
                setDataCombo={setDataCombo}
                change={changeCombo}
                setChange={setChangeCombo}
            />
        </div>
    );
};

export default ProductInfo;
