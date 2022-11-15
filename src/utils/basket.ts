import { filterProductOption, isEmptyObject, sortItemJson } from "@utils";

const mergeProduct = (arrFilter: any) => {
    let arr: any[] = [];
    const a = arrFilter.filter((e) => e.sku === arrFilter[0].sku);
    const b = arrFilter.filter((e) => e.sku !== arrFilter[0].sku);

    arr.push(a);

    if (b.length > 0) {
        return [a, ...mergeProduct(b)];
    } else {
        return arr;
    }
};

const handleCombo = (combos: any, prodsArr: any) => {
    if (combos.length > 0) {
        let arrCB: any[] = [];
        let arrProd: any[] = [];
        let arr: any[] = [];
        let cbs: any[] = [];
        const prod = [...prodsArr];

        combos.forEach((e) => {
            let err: boolean = false;
            e.items.some((i) => {
                if (
                    !prod.some((p) => p.id === i.productId) ||
                    !prod
                        .filter((p) => p.id === i.productId)
                        .reduce((pre, cur) => pre + cur.quantity, 0) >= i.quantity
                ) {
                    err = true;
                    return true;
                }
            });
            if (!err) {
                arr.push(e);
            }
        });

        const comboArr = arr
            .filter((e) =>
                e.items.every(
                    (i) =>
                        prod
                            .filter((p) => p.id === i.productId)
                            .reduce((pre, cur) => pre + cur.quantity, 0) >= i.quantity
                )
            )
            .sort(
                (a, b) =>
                    b.items.reduce((prev, curr) => prev + curr.quantity, 0) -
                    a.items.reduce((prev, curr) => prev + curr.quantity, 0)
            );

        if (comboArr.length > 0) {
            let prodArr: any[] = [];

            prod.forEach((el) => {
                for (let i = 1; i <= el.quantity; i++) {
                    prodArr.push({ ...el, quantity: 1 });
                }
            });
            const prodArr1 = [...prodArr];

            let prodArr3 = [...prodArr];

            comboArr[0].items.forEach((e) => {
                const tempArr = [...prodArr3];
                arrCB.push(
                    ...prodArr1.filter((prod) => prod.id === e.productId).slice(0, e.quantity)
                );
                prodArr3 = [
                    ...tempArr
                        .filter((prod) => prod.id === e.productId)
                        .slice(e.quantity, tempArr.length),
                    ...tempArr.filter((prod) => prod.id !== e.productId),
                ];
            });
            arrProd.push(...prodArr3);
            cbs.push({
                name: comboArr[0].name,
                quantity: 1,
                salePrice: comboArr[0].price,
                code: comboArr[0].code,
                products: mergeProduct(arrCB).map((item) => {
                    return { ...item[0], quantity: item.length };
                }),
            });

            return [...cbs, ...handleCombo(combos, arrProd)];
        } else {
            return cbs;
        }
    }
};

const handleProduct = (combos: any, prodsArr: any) => {
    let arrCB: any[] = [];
    let arrProd: any[] = [];
    let arr: any[] = [];
    const prod = [...prodsArr];
    let pro = [...prodsArr];

    combos.forEach((e) => {
        let err: boolean = false;
        e.items.some((i) => {
            if (
                !prod.some((p) => p.id === i.productId) ||
                !prod
                    .filter((p) => p.id === i.productId)
                    .reduce((pre, cur) => pre + cur.quantity, 0) >= i.quantity
            ) {
                err = true;
                return true;
            }
        });
        if (!err) {
            arr.push(e);
        }
    });

    const comboArr = arr
        .filter((e) =>
            e.items.every(
                (i) =>
                    prod
                        .filter((p) => p.id === i.productId)
                        .reduce((pre, cur) => pre + cur.quantity, 0) >= i.quantity
            )
        )
        .sort(
            (a, b) =>
                b.items.reduce((prev, curr) => prev + curr.quantity, 0) -
                a.items.reduce((prev, curr) => prev + curr.quantity, 0)
        );

    if (comboArr.length > 0) {
        let prodArr: any[] = [];

        prod.forEach((el) => {
            for (let i = 1; i <= el.quantity; i++) {
                prodArr.push({ ...el, quantity: 1 });
            }
        });
        const prodArr1 = [...prodArr];

        let prodArr3 = [...prodArr];

        comboArr[0].items.forEach((e) => {
            const tempArr = [...prodArr3];
            arrCB.push(...prodArr1.filter((prod) => prod.id === e.productId).slice(0, e.quantity));
            prodArr3 = [
                ...tempArr
                    .filter((prod) => prod.id === e.productId)
                    .slice(e.quantity, tempArr.length),
                ...tempArr.filter((prod) => prod.id !== e.productId),
            ];
        });
        arrProd.push(...prodArr3);
        return handleProduct(combos, arrProd);
    } else {
        return pro;
    }
};
export const handleUpdateItemBasket = (
    basket: any,
    item: any,
    options: any,
    isAdd: boolean,
    value?: any,
    promotion?: any
) => {
    let body;
    let products: any[] = [];
    basket.products.map((item: any, index: number) => {
        return products.push({
            ...item,
            index,
        });
    });

    let bonusProducts: any[] = [];
    basket.bonusProducts.map((item: any, index: number) => {
        return bonusProducts.push({
            ...item,
            index,
        });
    });

    const combos = basket.combos;

    const productSameID = products.filter((e: any) => e.id === item.id);
    const productsOld = products.filter((e: any) => e.id !== item.id);

    const productSameOption = filterProductOption(options, productSameID, true);
    const productDifferOption = filterProductOption(options, productSameID, false);

    let productSamePromotion: any[] = [];
    let productDifferPromotion: any[] = [];
    let productHasPromotion: any[] = [];
    if (promotion) {
        productSamePromotion = productSameOption.filter(
            (e: any) => e.promotion?.productId === item.promotion.productId
        );
        productDifferPromotion = productSameOption.filter(
            (e: any) => e.promotion?.productId !== item.promotion.productId
        );
    } else {
        productHasPromotion = productSameOption.filter((e: any) => e.promotion);
        productDifferPromotion = productSameOption.filter((e: any) => !e.promotion);
    }
    const bonusProductsSameID = bonusProducts.filter((e: any) => e.id === promotion?.id);
    const bonusProductsOld = bonusProducts.filter((e: any) => e.id !== promotion?.id);
    const bonusSameProduct = bonusProductsSameID.filter(
        (e: any) => e.promotion?.productId === promotion?.promotion?.productId
    );
    const bonusDifferProduct = bonusProductsSameID.filter(
        (e: any) => e.promotion?.productId !== promotion?.promotion?.productId
    );

    if (productSameOption.length > 0) {
        if (isAdd) {
            if (promotion) {
                let bonus;
                if (bonusProductsSameID.length > 0) {
                    if (bonusSameProduct.length > 0) {
                        bonus = [
                            ...bonusProductsOld,
                            ...bonusDifferProduct,
                            {
                                ...bonusSameProduct[0],
                                quantity: bonusSameProduct[0].quantity + promotion.quantity,
                                sku: promotion.sku,
                                options: promotion.options,
                            },
                        ];
                    } else {
                        bonus = [
                            ...bonusProductsOld,
                            ...bonusDifferProduct,
                            {
                                ...promotion,
                            },
                        ];
                    }
                } else {
                    bonus = [...bonusProductsOld, { ...promotion }];
                }
                body = {
                    ...basket,
                    products: sortItemJson(
                        [
                            ...productsOld,
                            ...productDifferOption,
                            {
                                ...productSameOption[0],
                                quantity: productSameOption[0]?.quantity + value.quantity,
                                discount: value?.data?.discount,
                                promotion: value?.data?.promotion,
                            },
                        ],
                        "index",
                        "ASC"
                    ),
                    bonusProducts: bonus,
                };
                // if (productSamePromotion.length > 0) {
                //     body = {
                //         ...basket,
                //         products: sortItemJson(
                //             [
                //                 ...productsOld,
                //                 ...productDifferOption,
                //                 ...productDifferPromotion,
                //                 {
                //                     ...productSamePromotion[0],
                //                     quantity: productSamePromotion[0]?.quantity + value.quantity,
                //                 },
                //             ],
                //             "index",
                //             "ASC"
                //         ),
                //         bonusProducts: bonus,
                //     };
                // } else {
                //     body = {
                //         ...basket,
                //         products: sortItemJson(
                //             [
                //                 ...productsOld,
                //                 ...productDifferOption,
                //                 ...productDifferPromotion,
                //                 {
                //                     ...productSameOption[0],
                //                     quantity: value.quantity,
                //                     promotion: value?.data?.promotion,
                //                 },
                //             ],
                //             "index",
                //             "ASC"
                //         ),
                //         bonusProducts: bonus,
                //     };
                // }
            } else {
                // body = {
                //     ...basket,
                //     products: sortItemJson(
                //         [
                //             ...productsOld,
                //             ...productDifferOption,
                //             ...productHasPromotion,
                //             {
                //                 ...productSameOption[0],
                //                 quantity:
                //                     productDifferPromotion.length > 0
                //                         ? productDifferPromotion[0]?.quantity + value.quantity
                //                         : value.quantity,
                //                 promotion: value?.data?.promotion,
                //             },
                //         ],
                //         "index",
                //         "ASC"
                //     ),
                // };
                body = {
                    ...basket,
                    products: sortItemJson(
                        [
                            ...productsOld,
                            ...productDifferOption,
                            {
                                ...productSameOption[0],
                                quantity: productSameOption[0]?.quantity + value.quantity,
                                discount: value?.data?.discount,
                                promotion: value?.data?.promotion,
                            },
                        ],
                        "index",
                        "ASC"
                    ),
                };
            }
        } else {
            if (value) {
                if (promotion) {
                    if (productSamePromotion.length > 0) {
                        body = {
                            ...basket,
                            products: sortItemJson(
                                [
                                    ...productsOld,
                                    ...productDifferOption,
                                    ...productDifferPromotion,
                                    {
                                        ...productSamePromotion[0],
                                        quantity: value.quantity,
                                    },
                                ],
                                "index",
                                "ASC"
                            ),
                        };
                    } else {
                        body = {
                            ...basket,
                            products: sortItemJson(
                                [
                                    ...productsOld,
                                    ...productDifferOption,
                                    ...productDifferPromotion,
                                    {
                                        ...productSameOption[0],
                                        quantity: value.quantity,
                                    },
                                ],
                                "index",
                                "ASC"
                            ),
                        };
                    }
                } else {
                    body = {
                        ...basket,
                        products: sortItemJson(
                            [
                                ...productsOld,
                                ...productDifferOption,
                                ...productHasPromotion,
                                {
                                    ...productDifferPromotion[0],
                                    quantity: value.quantity,
                                },
                            ],
                            "index",
                            "ASC"
                        ),
                    };
                }
            } else {
                if (promotion) {
                    body = {
                        ...basket,
                        products: sortItemJson(
                            [...productsOld, ...productDifferOption, ...productDifferPromotion],
                            "index",
                            "ASC"
                        ),
                    };
                } else {
                    body = {
                        ...basket,
                        products: sortItemJson(
                            [...productsOld, ...productDifferOption, ...productHasPromotion],
                            "index",
                            "ASC"
                        ),
                    };
                }
            }
        }
    } else {
        if (promotion) {
            let bonus;
            if (bonusProductsSameID.length > 0) {
                if (bonusSameProduct.length > 0) {
                    bonus = [
                        ...bonusProductsOld,
                        ...bonusDifferProduct,
                        {
                            ...bonusSameProduct[0],
                            quantity: bonusSameProduct[0].quantity + promotion.quantity,
                            sku: promotion.sku,
                            options: promotion.options,
                        },
                    ];
                } else {
                    bonus = [
                        ...bonusProductsOld,
                        ...bonusDifferProduct,
                        {
                            ...promotion,
                        },
                    ];
                }
            } else {
                bonus = [...bonusProductsOld, { ...promotion }];
            }

            body = {
                ...basket,
                products: sortItemJson(
                    [
                        ...productsOld,
                        ...productDifferOption,
                        {
                            id: value?.data?.id,
                            slug: value?.data?.slug,
                            name: value?.data?.name,
                            imageUrl: value?.data?.images[0]?.imageUrl,
                            quantity: value?.quantity,
                            discount: value?.data?.discount,
                            price: value?.data?.salePrice,
                            sku:
                                value?.data?.optionGroups?.length > 0
                                    ? value?.sku
                                    : value?.data?.sku,
                            options: options,
                            promotion: value?.data?.promotion,
                        },
                    ],
                    "index",
                    "ASC"
                ),
                bonusProducts: bonus,
            };
        } else {
            body = {
                ...basket,
                products: sortItemJson(
                    [
                        ...productsOld,
                        ...productDifferOption,
                        {
                            id: value?.data?.id,
                            slug: value?.data?.slug,
                            name: value?.data?.name,
                            imageUrl: value?.data?.images[0]?.imageUrl,
                            quantity: value?.quantity,
                            discount: value?.data?.discount,
                            price: value?.data?.salePrice,
                            sku:
                                value?.data?.optionGroups?.length > 0
                                    ? value?.sku
                                    : value?.data?.sku,
                            options: options,
                            promotion: value?.data?.promotion,
                        },
                    ],
                    "index",
                    "ASC"
                ),
            };
        }
    }
    const combosOld = combos.filter((e) => e.products.every((prod) => prod.id !== item.id));
    let arrProdCB: any[] = [];
    if (combos.length > 0) {
        combos
            .filter((e) => e.products.some((prod) => prod.id === item.id))
            .forEach((el) => {
                el.products.forEach((prod) => {
                    arrProdCB.push(prod);
                });
            });
    }

    if (item.combos !== null && item.combos?.length > 0) {
        body = {
            ...basket,
            products:
                handleProduct(item.combos, [...body.products, ...arrProdCB]).length > 0
                    ? sortItemJson(
                          [
                              ...mergeProduct(
                                  handleProduct(item.combos, [...body.products, ...arrProdCB])
                              ).map((item) => {
                                  return { ...item[0], quantity: item.length };
                              }),
                          ],
                          "index",
                          "ASC"
                      )
                    : [],
            combos: [...combosOld, ...handleCombo(item.combos, [...body.products, ...arrProdCB])],
        };
    }
    return {
        productsOld,
        productSameOption,
        productDifferOption,
        productDifferPromotion,
        productHasPromotion,
        body,
    };
};

export const handleUpdateQuantity = (basket: any, index: number, quantity: number, item: any) => {
    let products: any[] = [];

    basket.products.map((item: any, key: number) => {
        return products.push({
            ...item,
            index: key,
        });
    });

    const productUpdateQty = products.find((value) => value.index === index);
    const productOld = products.filter((e) => e.index !== index);
    const productSameIDPromotion = products.filter(
        (e) => e.id === productUpdateQty.id && e.promotion && e.index !== index
    );

    const bonusUpdateQty = basket.bonusProducts.filter(
        (e: any) => e.promotion?.productId === productUpdateQty.id
    );
    const bonusOld = basket.bonusProducts.filter(
        (e: any) => e.promotion?.productId !== productUpdateQty.id
    );

    const bonus = productUpdateQty.promotion?.bonusItems.find(
        (e: any) => e?.productId === bonusUpdateQty[0].id
    );

    let bonusProd;

    if (productUpdateQty.promotion) {
        if (bonus) {
            bonusProd = [
                ...bonusOld,
                {
                    ...bonusUpdateQty[0],
                    quantity:
                        bonus.quantity *
                        (productSameIDPromotion.reduce(
                            (prev, current) => prev + current?.quantity,
                            0
                        ) +
                            quantity),
                },
            ];
        } else {
            bonusProd = basket.bonusProducts;
        }
    } else {
        bonusProd = basket.bonusProducts;
    }
    let body = {
        ...basket,
        products: sortItemJson(
            [
                ...productOld,
                {
                    ...productUpdateQty,
                    quantity: quantity,
                },
            ],
            "index",
            "ASC"
        ),
        bonusProducts: bonusProd,
    };
    if (item.combos !== null && item.combos?.length > 0) {
        body = {
            ...basket,
            products:
                handleProduct(item.combos, body.products).length > 0
                    ? sortItemJson(
                          [
                              ...mergeProduct(handleProduct(item.combos, body.products)).map(
                                  (item) => {
                                      return { ...item[0], quantity: item.length };
                                  }
                              ),
                          ],
                          "index",
                          "ASC"
                      )
                    : [],
            combos: [...basket.combos, ...handleCombo(item.combos, body.products)],
        };
    }

    return { body };
};

export const handleDeleteBasket = (basket: any, index: number) => {
    let products: any[] = [];

    basket.products
        .filter((e: any, key: number) => key !== index)
        .map((item: any, index: number) => {
            return products.push({
                ...item,
                index,
            });
        });

    const productDelete = basket.products.find((e: any, key: number) => key === index);
    const productSameIDPromotion = products.filter(
        (e) => e.id === productDelete.id && e.promotion && e.index !== index
    );
    const bonusDelete = basket.bonusProducts.filter(
        (e: any) => e.promotion?.productId === productDelete.id
    );
    const bonusOld = basket.bonusProducts.filter(
        (e: any) => e.promotion?.productId !== productDelete.id
    );

    const bonus = productDelete.promotion?.bonusItems.find(
        (e: any) => e?.productId === bonusDelete[0]?.id
    );

    let bonusProd;

    if (productDelete.promotion) {
        if (bonus) {
            if (
                bonus.quantity *
                    productSameIDPromotion.reduce(
                        (prev, current) => prev + current?.quantity,
                        0
                    ) ===
                0
            ) {
                bonusProd = [...bonusOld];
            } else {
                bonusProd = [
                    ...bonusOld,
                    {
                        ...bonusDelete[0],
                        quantity:
                            bonus.quantity *
                            productSameIDPromotion.reduce(
                                (prev, current) => prev + current?.quantity,
                                0
                            ),
                    },
                ];
            }
        } else {
            bonusProd = basket.bonusProducts;
        }
    } else {
        bonusProd = basket.bonusProducts;
    }

    const body = {
        ...basket,
        products: sortItemJson([...products], "index", "ASC"),
        bonusProducts: bonusProd,
    };

    return { products, body, productDelete };
};

export const handleAddCombo = (basket: any, combo: any, data: any) => {
    const body = {
        ...basket,
        combos: [
            ...basket.combos,
            {
                name: combo.name,
                quantity: combo.quantity,
                salePrice: combo.salePrice,
                code: combo.code,
                products: data,
            },
        ],
    };
    return { body };
};

export const handleDeleteCombo = (basket: any, index: number) => {
    let combos: any[] = [];

    basket.combos
        .filter((e: any, key: number) => key !== index)
        .map((item: any, index: number) => {
            return combos.push({
                ...item,
                index,
            });
        });

    const body = {
        ...basket,
        combos: sortItemJson([...combos], "index", "ASC"),
    };

    return { combos, body };
};
