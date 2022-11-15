import React, { useEffect, useState } from "react";
import BaseModal from "@@@Modal";
import style from "./ComboModal.module.scss";
import IconClose from "@assets/icons/clode-light.svg";
import classNames from "classnames";
import CachedImage from "@components/Common/CachedImage";
import { EnumGroupOptionsProduct } from "@constants/enum";
import { formatPrice, isEmptyObject } from "@utils";

const ComboModal = (props: any) => {
    const { isShow, onClose, onConfirm, data,  dataCombo, setDataCombo, change, setChange} = props;

    const [disableButton, setDisableButton] = useState(true);
    const [priceStock, setPriceStock] = useState(0);

    const mergeProduct = (arrFilter: any) => {
        let arr: any[] = [];
        const a = arrFilter.filter((e) => JSON.stringify(e) === JSON.stringify(arrFilter[0]));
        const b = arrFilter.filter((e) => JSON.stringify(e) !== JSON.stringify(arrFilter[0]));

        arr.push(a);

        if (b.length > 0) {
            return [a, ...mergeProduct(b)];
        } else {
            return arr;
        }
    };

    useEffect(() => {
        if (isShow) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isShow]);

    useEffect(() => {
        if (!change) {
            if (data) {
                let result: any = [];
                let delPrice = 0;
                data?.items?.forEach((item, i) => {
                    for (let index = 0; index < item.quantity; index++) {
                        delPrice = delPrice + item.product.salePrice;

                        result.push({
                            idIndex: `item_${i}_${index}`,
                            productId: item.productId,
                            comboId: item.comboId,
                            product: item.product,
                            optionColor: item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.COLOR) 
                                ? item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.COLOR).options.find((e) => e.isDefault) ?? item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.COLOR).options[0] 
                                : {},
                            optionSize: item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.SIZE) 
                                ? item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.SIZE).options.find((e) => e.isDefault) ?? item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.SIZE).options[0] 
                                : {},
                            isRequiredColor: item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.COLOR)?.required ?? false,
                            isRequiredSize: item.product.optionGroups.find((e) => e.groupType === EnumGroupOptionsProduct.SIZE)?.required ?? false,
                        });
                    }
                });

                setDataCombo(result);
                setPriceStock(delPrice);
            }
        }
    }, [data, change]);

    useEffect(() => {
        let disable = false;
        dataCombo.forEach((item: any) => {
            if ((item.isRequiredColor && isEmptyObject(item.optionColor)) || (item.isRequiredSize && isEmptyObject(item.optionSize))) {
                disable = true;
            }
        });

        setDisableButton(disable);
    }, [dataCombo]);

    const onChangeColor = (option, idIndex) => {
        setChange(true);

        let itemFind: any = dataCombo.find((item: any) => item.idIndex === idIndex);

        let change: any = [
            ...dataCombo.filter((item: any) => item.idIndex !== idIndex),
            {
                ...itemFind,
                optionColor: option,
            },
        ];

        setDataCombo(change);
    };

    const onChangeSize = (option, idIndex) => {
        setChange(true);

        let itemFind: any = dataCombo.find((item: any) => item.idIndex === idIndex);

        let change: any = [
            ...dataCombo.filter((item: any) => item.idIndex !== idIndex),
            {
                ...itemFind,
                optionSize: option,
            },
        ];

        setDataCombo(change);
    };

    const onSubmit = () => {
        let result = dataCombo.map((item) => {
            delete item["idIndex"];
            return item;
        });

        let dataSKU = result.map((item) => {
            let sku = item?.product?.sku;
            item?.product?.mappings?.map((e: any) => {
                let a = JSON.stringify(e.uniqueOptionIds.sort((a: number, b: number) => a - b));
                let b = JSON.stringify(
                    [item.optionColor.id, item.optionSize.id].sort((a: number, b: number) => a - b)
                );
                if (a == b) {
                    sku = e.sku;
                }
            });
            return { ...item, sku: sku };
        });

        const res = mergeProduct(dataSKU).map((item) => {
            return { ...item[0], quantity: item.length };
        });

        onConfirm({
            name: data?.name,
            quantity: 1,
            salePrice: data?.price,
            code: data?.code,
            data: res,
            maxQty: data?.maxQuantity
        });
        setDataCombo([]);
    };

    return (
        <div className={classNames(style.comboModal, { [style.active]: isShow })}>
            <div className={style.modal}>
                <div className={style.header}>
                    <div className={style.title}>Mua combo sản phẩm với giá ưu đãi</div>
                    <div className={style.close} onClick={onClose}>
                        <IconClose />
                    </div>
                </div>
                <div className={style.body}>
                    <div className={style.listProduct}>
                        {data?.items?.map((item, i) => {
                            let result: any = [];
                            for (let index = 0; index < item.quantity; index++) {
                                result.push(
                                    <div className={style.item}>
                                        <div className={style.info}>
                                            <div className={style.image}>
                                                <CachedImage
                                                    src={item?.product?.images[0].imageUrl}
                                                />
                                            </div>
                                            <div className={style.product}>
                                                <div className={style.name}>
                                                    {item.product?.name}
                                                </div>
                                                {item.product?.optionColors?.length > 0 && (
                                                    <div className={style.color}>
                                                        <span>Màu sắc:</span>
                                                        <ul>
                                                            {item.product?.optionColors?.map(
                                                                (li) => {
                                                                    return (
                                                                        <li
                                                                            className={classNames({
                                                                                [style.active]:
                                                                                    dataCombo.find(
                                                                                        (
                                                                                            item: any
                                                                                        ) =>
                                                                                            item.idIndex ===
                                                                                            `item_${i}_${index}`
                                                                                    )?.optionColor
                                                                                        .id ===
                                                                                    li.id,
                                                                            })}
                                                                            onClick={() =>
                                                                                onChangeColor(
                                                                                    li,
                                                                                    `item_${i}_${index}`
                                                                                )
                                                                            }
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    backgroundColor: `${li.fieldData}`,
                                                                                }}
                                                                            ></div>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {item.product?.optionGroups?.length > 0 && (
                                                    <div className={style.size}>
                                                        <span>Kích cỡ:</span>
                                                        <ul>
                                                            {item.product?.optionGroups
                                                                ?.find(
                                                                    (e: any) =>
                                                                        e.groupType.toLowerCase() ===
                                                                        EnumGroupOptionsProduct.SIZE.toLowerCase()
                                                                )
                                                                .options.map((li) => {
                                                                    return (
                                                                        <li
                                                                            className={classNames({
                                                                                [style.active]:
                                                                                    dataCombo.find(
                                                                                        (
                                                                                            item: any
                                                                                        ) =>
                                                                                            item.idIndex ===
                                                                                            `item_${i}_${index}`
                                                                                    )?.optionSize
                                                                                        .id ===
                                                                                    li.id,
                                                                            })}
                                                                            onClick={() =>
                                                                                onChangeSize(
                                                                                    li,
                                                                                    `item_${i}_${index}`
                                                                                )
                                                                            }
                                                                        >
                                                                            {li.name}
                                                                        </li>
                                                                    );
                                                                })}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={style.price}>
                                            {formatPrice(
                                                item.product?.salePrice - item.product?.discount ||
                                                    0
                                            )}
                                            {item.product?.discount > 0 && (
                                                <del>
                                                    {formatPrice(item.product?.salePrice || 0)}
                                                </del>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            return result;
                        })}
                    </div>
                    <div className={style.total}>
                        Tổng cộng: {formatPrice(data?.price || 0)}
                        <del>{formatPrice(priceStock || 0)}</del>
                    </div>
                </div>
                <div className={style.footer}>
                    <button
                        className={classNames({ [style.disable]: disableButton })}
                        onClick={onSubmit}
                    >
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComboModal;
