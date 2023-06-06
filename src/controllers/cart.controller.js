import CartManager from "../services/CartManager.js";
const carts = new CartManager("Carts.json");

const newCart = async (req, res) => {
  await carts.newCart();
  res.send("Hola");
};
const getCartByID = async (req, res) => {
  try {
    let idCard = +req.params.cid;
    let cartByID = await carts.getCartByID(idCard);
    if (!cartByID) {
      res.status(404).send({
        status: "error",
        message: `Not Found: No se encontro carrito con el id ${idCard}`,
      });
    } else {
      res.send({
        status: "succses",
        payload: cartByID,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: `Error al BUSCAR carito id: ${error}`,
    });
  }
};
const addProductsToCart = async (req, res) => {
  try {
    const cartId = +req.params.cid;
    const productId = +req.params.pid;

    if (productId <= 0) {
      return res.status(404).json({ error: "Producto no válido" });
    }

    if (cartId <= 0) {
      return res.status(404).json({ error: "Producto no válido" });
    }

    // Obtener el carrito por ID
    const cart = await carts.getCartByID(cartId);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartId} no existe` });
    }

    // Agregamos el producto al carrito
    await carts.addProductsToCart(cartId, productId);

    res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error en el servidor" });
  }
};

export { newCart, getCartByID, addProductsToCart };
