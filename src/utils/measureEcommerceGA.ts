const dataList = (response) =>{
  const data:any[] = []
  response.products?.forEach((item, key)=>{
      data.push({
          item_id: item.sku,
          item_name: item.name,
          affiliation: "VmStyle",
          currency: "VND",
          discount: item.discount,
          index: key + 1,
          item_brand: "VmStyle",
          item_variant: item.options.map((val)=> val.name).join('/'),
          price: item.price,
          quantity: item.quantity
      })
  })
  response.bonusProducts?.forEach((item, key)=>{
      data.push({
          item_id: item.sku,
          item_name: item.name,
          affiliation: "VmStyle",
          index: response.products.length + key + 1,
          currency: "VND",
          discount: item.discount,
          item_brand: "VmStyle",
          item_variant: item.options.map((val)=> val.name).join('/'),
          price: item.price,
          quantity: item.quantity,
          promotion_name: item?.promotion?.name
      })
  })
  response.combos?.forEach((item)=>{
      const pricePer = item.salePrice / item.products.reduce((prev,cur) => prev + cur.quantity, 0)
      item.products.forEach((prod, key) =>{
          data.push({
              item_id: prod.sku,
              item_name: prod.name,
              affiliation: "VmStyle",
              coupon: item?.code || item?.name,
              currency: "VND",
              discount: prod.discount,
              index:response.products.length + response.bonusProducts.length + key + 1,
              item_brand: "VmStyle",
              item_variant: prod.options.map((val)=> val.name).join('/'),
              price: pricePer * prod.quantity,
              quantity: prod.quantity
          })
      })
      
  })
  return data;
}
export const addToCartFunc = (response) =>{
  const data = dataList(response);
  
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
          items: data
      }
  })
}

export const removeFromCartFunc = (response) => {
  const data = [{
    item_id: response.sku,
    item_name: response.name,
    affiliation: "VmStyle",
    currency: "VND",
    discount: response.discount,
    index: 0,
    item_brand: "VmStyle",
    item_variant: response.options.map((val)=> val.name).join('/'),
    price: response.price,
    quantity: response.quantity
  }]
  
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
          items: data
      }
  })
}

export const viewCartFunc = (response) => {
  const data = dataList(response)
  
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'view_cart',
      ecommerce: {
        currency: "VND",
        value: response.totalPrice - response.totalDiscount,
        items: data
      }
  })
}

export const beginCheckoutFunc = (response) => {
  const data = dataList(response)
  
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        items: data
      }
  })
}

export const addShippingInfoFunc = (response, delivery) => {
  const data = dataList(response)
  
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'add_shipping_info',
      ecommerce: {
        currency: "VND",
        value: response.totalPrice - response.totalDiscount,
        shipping_tier: delivery,
        items: data
      }
  })
}

export const addPaymentInfoFunc = (response, payment) => {
  const data = dataList(response)
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
      event: 'add_payment_info',
      ecommerce: {
        currency: "VND",
        value: response.totalPrice - response.totalDiscount,
        payment_type: payment,
        items: data
      }
  })
}

export const purchaseFunc = (response) =>{
  const data: any[] = [];
  response.items.forEach((item, key) =>{
    data.push({
      item_id: item.sku,
      item_name: item.name,
      affiliation: "VmStyle",
      currency: "VND",
      discount: item.discount,
      index: key + 1,
      item_brand: "VmStyle",
      item_variant: item.description,
      price: item.price,
      promotion_name: item.comboName || null,
      quantity: item.quantity
    })
  })

  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: response?.code,
      affiliation: "VmStyle",
      value: response?.total,
      shipping: response?.shipping.estimatedAmount,
      currency: "VND",
      coupon: response?.voucher?.code || response.voucher?.name,
      items: data
    }
  })
}

export const selectItemFunc = (response) =>{
  const renderCate = (data) =>{
    let arr: any[] = [];
    arr.push(data.name)
    if(data.parent !== null){
      return [...arr, ...renderCate(data.parent)]
    } else{
      return arr
    }
  }
  const arrCate = renderCate(response?.categories[0])?.reverse();
  let dataCate: any = {};
  arrCate.map((item, key) =>{
    if(key === 0){
      return dataCate[`item_category`] = item
    } else{
      return dataCate[`item_category${key+1}`] = item
    }
    
  })
  
  const data = [{
    item_id: response.sku,
    item_name: response.name,
    affiliation: "VmStyle",
    currency: "VND",
    discount: response.discount,
    index: 1,
    ...dataCate,
    item_list_id: response?.categories[0]?.id,
    item_list_name: response?.categories[0]?.name,
    item_variant: response.mappings.find((e) => e.sku === response.stocks.find((e) =>e.quantity>0).sku).displayName,
    price: response.salePrice,
    quantity: 1,
    promotion_name: response.promotion?.name
  }]

  window.dataLayer.push({ ecommerce: null }); 
  window.dataLayer.push({
    event: "select_item",
    ecommerce: {
      items: data
    }
  })
}

export const viewItemFunc = (response) =>{
  const renderCate = (data) =>{
    let arr: any[] = [];
    arr.push(data.name)
    if(data.parent !== null){
      return [...arr, ...renderCate(data.parent)]
    } else{
      return arr
    }
  }
  const arrCate = renderCate(response?.categories[0])?.reverse();
  let dataCate: any = {};
  arrCate.map((item, key) =>{
    if(key === 0){
      return dataCate[`item_category`] = item
    } else{
      return dataCate[`item_category${key+1}`] = item
    }
    
  })
  
  const data = [{
    item_id: response.sku,
    item_name: response.name,
    affiliation: "VmStyle",
    currency: "VND",
    discount: response.discount,
    index: 1,
    ...dataCate,
    item_list_id: response?.categories[0]?.id,
    item_list_name: response?.categories[0]?.name,
    item_variant: response.mappings.find((e) => e.sku === response.stocks.find((e) =>e.quantity>0).sku).displayName,
    price: response.salePrice,
    quantity: 1,
    promotion_name: response.promotion?.name
  }]
  
  window.dataLayer.push({ ecommerce: null }); 
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      items: data
    }
  })
}
