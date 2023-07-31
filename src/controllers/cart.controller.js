// import CartManager from "../dao/fileManager/CartManager.js";
// const carts = new CartManager("Carts.json");
import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';

const newCart = async (req, res) => {
  try {
    const cart = req.body;
    const resNewCart = await cartsModel.create(cart);
    console.log(resNewCart);
    res.status(400).json({
      status: 'succses',
      message: 'Se CREO correctamente el carrito '
    });
  } catch (error) {
    res.status(400).send({
      status: 'error',
      message: `Error al CREAR un carrito: ${error.message}`
    });
  }
};

const getCartByID = async (req, res) => {
  const idCard = req.params.cid;
  try {
    const cartByID = await cartsModel.findOne({ _id: idCard });
    console.log(cartByID);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `No se ENCONTRO carrito con el id ${idCard}`
      });
    }
    res.status(200).json({
      status: 'succses',
      payload: cartByID
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito con el id ${idCard}`
    });
  }
};

const addProductsToCart = async (req, res) => {
  const idCard = req.params.cid;
  const idProduct = req.params.pid;
  let cartByID = {};
  const productByID = {};

  try {
    cartByID = await cartsModel.findOne({ _id: idCard });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito con el id ${idCard}, ${error.message}`
    });
  }

  try {
    await productsModel.findOne({ _id: idProduct });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO el PRODUCTO con el id ${idProduct}, ${error.message}`
    });
  }
  try {
    const existingProduct = cartByID.products.findIndex((item) =>
      item.product.equals(idProduct)
    );
    if (existingProduct !== -1) {
      cartByID.products[existingProduct].quantity += 1;
    } else {
      const newProduct = {
        product: idProduct,
        quantity: 1
      };
      cartByID.products.push(newProduct);
    }
    const cartProductUpdate = await cartByID.save();
    res.status(200).json({
      status: 'succses',
      payload: cartProductUpdate
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `Error al AGREGAR un producto al carrito: ${error.message}`
    });
  }
};

const updateQuantityCartAndProduct = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  let cartByID = {};

  try {
    cartByID = await cartsModel.findOne({ _id: idCart });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito con el id ${idCart}, ${error.message}`
    });
  }

  try {
    const quantity = +req.body.quantity;
    if (!Number.isInteger(quantity) || quantity < 0) {
      // ? Mejorar el error
      throw new Error('Cantidad incorrecta');
    }
    const existingProduct = cartByID.products.findIndex((item) =>
      item.product.equals(idProduct)
    );

    if (existingProduct === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'El producto no se encuentra en el carrito'
      });
    }

    cartByID.products[existingProduct].quantity = quantity;

    const cartProductUpdate = await cartByID.save();
    res.status(200).json({
      status: 'succses',
      payload: cartProductUpdate
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: `Error al ACTUALIZAR un producto al carrito: ${error}`
    });
  }
};
const deleteProductForCart = async (req, res) => {
  const idCart = req.params.cid;
  try {
    const cartDelete = await cartsModel
      .findByIdAndUpdate(idCart, { products: [] }, { new: true })
      .lean()
      .exec();

    if (!cartDelete) {
      return res
        .status(404)
        .json({ status: 'success', message: 'Carrito no existe' });
    }
    res.status(200).json({
      status: 'success',
      payload: cartDelete
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: `Error al Vaciar el carrito: ${error.message}`
    });
  }
};
const updateDataProductCart = async (req, res) => {
  const idCart = req.params.cid;
  let cartByID = {};
  try {
    cartByID = await cartsModel.findOne({ _id: idCart });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito con el id ${idCart}, ${error.message}`
    });
  }
  try {
    const dataProducts = req.body.products;
    if (!Array.isArray(dataProducts)) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos del PRODUCTO incorrecto'
      });
    }
    cartByID.products = dataProducts;
    // Guardamos el carrito actualizado
    const result = await cartByID.save();

    const totalPages = 1;
    const prevPage = null;
    const nextPage = null;
    const page = 1;
    const hasPrevPage = false;
    const hasNextPage = false;
    const prevLink = null;
    const nextLink = null;

    res.status(200).json({
      status: 'success',
      payload: result.products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `No se puedo ACTUALIZAR el producto del carrito: ${error.message}`
    });
  }
};

const deleteProductSelectCart = async (req, res) => {
  const idCard = req.params.cid;
  const idProduct = req.params.pid;
  let cartByID = {};
  try {
    cartByID = await cartsModel.findOne({ _id: idCard });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito con el id ${idCard}, ${error.message}`
    });
  }
  try {
    const existingProduct = cartByID.products.findIndex((item) =>
      item.product.equals(idProduct)
    );
    console.log(existingProduct);
    if (existingProduct !== -1) {
      console.log('hola');
      throw new Error('Producto no encontrado');
    }
    // Eliminamos el producto del carrito
    cartByID.products.splice(existingProduct, 1);
    const cartProductUpdate = await cartByID.save();
    res.status(200).json({
      status: 'succses',
      payload: cartProductUpdate
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `No se puedo eliminar el producto del carrito: ${error.message}`
    });
  }
};

export {
  newCart,
  getCartByID,
  addProductsToCart,
  updateQuantityCartAndProduct,
  updateDataProductCart,
  deleteProductForCart,
  deleteProductSelectCart
};
