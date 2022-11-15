export const renderDiscount = (
    salePrice: number,
    discount: number,
    maxDiscount: number,
    discountPercentage: number,
    fixedPrice: number
) => {
    let totalDiscount = discount;
    if (fixedPrice > 0) {
        totalDiscount = salePrice - fixedPrice;
    } else {
        if (discountPercentage > 0) {
            if (salePrice * discountPercentage > maxDiscount) {
                totalDiscount = maxDiscount;
            } else {
                totalDiscount = salePrice * discountPercentage;
            }
        }
    }
    return totalDiscount;
};
