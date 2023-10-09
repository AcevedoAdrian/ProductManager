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
      quantity: productStock
    });
  }
  if (cartUpdate.length !== 0) {
    const result = await updateCartQuantity(idCart, cartUpdate);
    console.log(result);
  }
  // try {
  //   const res = await fetch(`/api/carts/${idCart}/purchase`, {
  //     method: 'POST'
  //   });
  //   const result = await res.json();

  //   if (result.status === 'error') {
  //     throw new Error(result.error);
  //   }

  //   alert('Se agrego correctamente el producto');
  // } catch (error) {
  //   console.log(error);
  // }
}
// const updateCartQuantity = async (idCart, idProduct, quantity) => {
//   try {
//     const res = await fetch(`/api/${idCart}/product/${idProduct}`, {
//       method: 'PUT',
//       body: quantity
//     });
//     const result = await res.json();

//     if (result.status === 'error') {
//       throw new Error(result.error);
//     }

//     console.log(('Se agrego correctamente el producto'));
//   } catch (error) {
//     console.log(error);
//   }
// };

const updateCartQuantity = async (idCart, cartUpdate) => {
  console.log(cartUpdate);
  try {
    const res = await fetch(`/api/carts/${idCart}`, {
      method: 'PUT',
      body: JSON.stringify(cartUpdate)
    });

    const result = await res.json();

    if (result.status === 'error') {
      throw new Error(result.error);
    }

    return ('Se agrego correctamente el producto');
  } catch (error) {
    return (error);
  }
};
