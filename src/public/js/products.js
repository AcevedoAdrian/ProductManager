async function addToCart(idCart, idProduct) {
  try {
    // console.log({ idCart, idProduct });
    const res = await fetch(`/api/carts/${idCart}/product/${idProduct}`, {
      method: 'POST'
    });
    const result = await res.json();

    if (result.status === 'error') {
      throw new Error(result.error);
    }

    alert('Se agrego correctamente el producto');
  } catch (error) {
    console.log(error);
  }
}
