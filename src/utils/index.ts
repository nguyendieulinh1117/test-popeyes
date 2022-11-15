export * from "./createEmotionCache";

export const formatNumber = (value: any) => {
    if (value) {
        const decimalPosition = value.toString().indexOf(".");
        if (decimalPosition > 0) {
            const intVal = value.toString().substring(0, decimalPosition);
            const decimalVal = value.toString().substring(decimalPosition + 1);
            return `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalVal}`;
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return "";
};

export function formatPrice(val: any) {
    const value = val.toString();
    if (!value) return "0";
    const format = value.replace(/,/g, "");

    return format.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
}

export const getDisplayPrice = (price: any) => {
    const finalPrice = price?.gross || price?.net;
    if (finalPrice?.amount && finalPrice?.currency) {
        return `${formatNumber(finalPrice.amount)} ${finalPrice.currency}`;
    }
    return "-";
};

export const removeEmptyProperties = (obj: any) =>
    Object.keys(obj).reduce((rs: any, key: any) => {
        const val = obj[key];
        if (val === 0 || !!val) {
            rs[key] = val;
        }

        return rs;
    }, {});

export const mapJoin = (arr: [], joinKey: string = ",") => {
    return arr.map((e: any) => e).join(joinKey);
};

export function isEmptyObject(obj: any) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }
    return true;
}

export const sortItemJson = (arr: any, itemKey: string, method?: string) => {
    if(arr?.length < 1 || !arr) return [];

    let result = arr.sort(function (a: any, b: any) {
        if (method === "DECS") {
            return parseFloat(b[itemKey]) - parseFloat(a[itemKey]);
        } else {
            return parseFloat(a[itemKey]) - parseFloat(b[itemKey]);
        }
    });

    return result;
};

const equal = (a: any[], b: any[]) => {
    if (a.length !== b.length) {
        return false;
    } else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
};

export const filterProductOption = (options: any[], productList: any[], isSame: boolean) => {
    let arrRefactor: any[] = [];

    options.forEach((opt) => {
        arrRefactor[opt.id] = opt.name;
    });

    let result = productList.filter((e) => {
        let optionIds: any[] = [];

        e.options.forEach((opt: any) => {
            optionIds[opt.id] = opt.name;
        });

        return isSame ? equal(optionIds, arrRefactor) : !equal(optionIds, arrRefactor);
    });

    return result;
};
 
  
export const removeDuplicateArrayOfObject = (arr: any, key: string) => {
    let unique = arr
      .map((e: any) => e[key])
  
       // store the keys of the unique objects
      .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
  
      // eliminate the dead keys & store unique objects
      .filter((e: any) => arr[e]).map((e: any) => arr[e]);
  
     return unique;
}

export const parseArrDataToSelectOption =(arr: any[], sub:string|null = null)=>{
    if(sub){
        return arr?.map((province: any) => {
            return {
                value: province.id,
                label: province.name,
                childrens: province[sub],
            }
        })
    }
    return arr?.map((province: any) => {
        return {
            value: province.id,
            label: province.name,
        }
    })
};

export const fillterCustom = (arr: any[], key: string, valueCompare: any = null) => {
    if(valueCompare){
        return arr.filter((e: any) => e[key] === valueCompare);
    }
    return arr.filter((e: any) => e[key]);
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, match: string, replacement: string) {
    return str?.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
}

export const getLimitItems = (arr: any[], limit: number = 4) => {
    return arr?.slice(0, limit);
};

export const sortBoolean = (arr: object[], fieldSort, valuesFirst:boolean = true) => {
    return arr.sort(function(x, y) {
        if(valuesFirst){
            // true values first
            return (x[fieldSort] === y[fieldSort])? 0 : x[fieldSort]? -1 : 1;
        }
        // false values first
        return (x[fieldSort] === y[fieldSort])? 0 : x[fieldSort]? 1 : -1;
    });
}

export const cleanObject = (obj: any) => {
    let result = {};
    if (obj) {
        Object.keys(obj).forEach((key) => {
            if ((!Array.isArray(obj[key]) && obj[key]) || obj[key]?.length)
                result[key] = obj[key];
        });
    }
    return result;
};

export const getProductDetailUrl = (slug) => {
    if (slug) {
        return `/${slug}.html`;
    }
    return `/`;
};

export const getCategorieslUrl = (item: any) => {
    return `${item?.parent?.parent ? '/' + item?.parent?.parent?.slug : ''}${item.parent ? '/' + item?.parent?.slug : ''}/${item?.slug}`;
};
