async function finishBuyCartController(idCart) {
  // const products = document.querySelectorAll('.form-products');
  // const products = document.getElementById('form-products[type=item]');

  const productsCart = document.querySelector('#list-products-cart');
  const products = productsCart.querySelectorAll('item[data-product-id]');
  const cartUpdate = [];
  for (let i = 0; i < products.length; i++) {
    const productId = products[i].dataset.productId;
    const productStock = products[i].querySelector('input[data-product-stock]').value;

    cartUpdate.push({
      product: productId,
      quantity: +productStock
    });
  }
  if (cartUpdate.length !== 0) {
    const responseUpdateCart = await updateCartQuantity(idCart, cartUpdate);
    if (responseUpdateCart.status === 'error') {
      // console.log(responseUpdateCart.message);
    } else {
      const responseFinishBuyCart = await finishBuyCart(idCart);
      // console.log(responseFinishBuyCart.payload);
      const result = await redirectTicketView(responseFinishBuyCart._id);
    }
  }
}

const updateCartQuantity = async (idCart, cartUpdate) => {
  // console.log(cartUpdate);
  try {
    const res = await fetch(`/api/carts/${idCart}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartUpdate)
    });
    const result = await res.json();
    return (result);
  } catch (error) {
    return (error);
  }
};
const redirectTicketView = async (idTicket) => {
  try {
    const res = await fetch(`/ticket/${idTicket}`, {
      method: 'GET'
    });
    const result = await res.json();
    return (result);
  } catch (error) {
    return (error);
  }
};

const finishBuyCart = async (idCart) => {
  try {
    const res = await fetch(`/api/carts/${idCart}/purchase`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    return (result);
  } catch (error) {
    return (error);
  }
};
async function deleteProductCart(idCart, idProduct) {
  // const products = document.querySelectorAll('.form-products');
  // const products = document.getElementById('form-products[type=item]');
  try {
    const res = await fetch(`/api/carts/${idCart}/product/${idProduct}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.status === 'success') {
      location.reload();
    }
  } catch (error) {
    console.loglo(error);
  }
  // const productsCart = document.querySelector('#list-products-cart');
  // const products = productsCart.querySelectorAll('item[data-product-id]');
  // const cartUpdate = [];
  // for (let i = 0; i < products.length; i++) {
  //   const productId = products[i].dataset.productId;
  //   const productStock = products[i].querySelector('input[data-product-stock]').value;

  //   cartUpdate.push({
  //     product: productId,
  //     quantity: +productStock
  //   });
  // }
  // if (cartUpdate.length !== 0) {
  //   const responseUpdateCart = await updateCartQuantity(idCart, cartUpdate);
  //   if (responseUpdateCart.status === 'error') {
  //     console.log(responseUpdateCart.message);
  //   } else {
  //     const responseFinishBuyCart = await finishBuyCart(idCart);
  //     console.log(responseFinishBuyCart.payload);
  //     const result = await redirectTicketView(responseFinishBuyCart._id);
  //   }
  // }
}
