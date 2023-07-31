const cart = '64be95141c92e5cca77b56fb';
const addToCart = async (id) => {
  try {
    console.log({ id });
    const res = await fetch(`/api/carts/${cart}/product/${id}`, {
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
};
