import CartManager from "../dao/fileManager/CartManager.js";
const carts = new CartManager("Carts.json");

const newCart = async (req, res) => {
  try {
    let resNewProduct = await carts.newCart();

    if (!resNewProduct) {
      res.send({
        status: "succses",
        message: `Se CREO correctamente el carrito `,
      });
    } else {
      res.status(400).send({ status: "error", message: resAddProduct.message });
    }
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: `Error al CREAR un carrito: ${error}`,
    });
  }
};
const getCartByID = async (req, res) => {
  try {
    let idCard = +req.params.cid;
    let cartByID = await carts.getCartByID(idCard);
    if (!cartByID) {
      res.status(404).send({
        status: "error",
        message: `Not Found: No se ENCONTRO carrito con el id ${idCard}`,
      });
    } else {
      res.send({
        status: "succses",
        payload: cartByID,
      });
    }
  } catch (error) {
    res.status(500).send({
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
      return res.status(404).json({ error: "Carrito no válido" });
    }

    // Agregamos el producto al carrito
    let resAddProductToCart = await carts.addProductsToCart(cartId, productId);
    if (!resAddProductToCart) {
      res.send({
        status: "succses",
        message: `Se agrego correctamente el producto ${productId} al carrito ${cartId}`,
      });
    } else {
      res
        .status(400)
        .send({ status: "error", message: resAddProductToCart.message });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al AGREGAR un producto al carrito: ${error}`,
    });
  }
};

export { newCart, getCartByID, addProductsToCart };
