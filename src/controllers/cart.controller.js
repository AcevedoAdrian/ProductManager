// import CartManager from "../dao/fileManager/CartManager.js";
// const carts = new CartManager("Carts.json");
import { CartService } from '../services/carts.services.js';
import { ProductService } from '../services/products.service..js';

const getCartByIDController = async (req, res) => {
  try {
    const idCart = req.params.cid;
    // const cartByID = await cartsModel.findOne({ _id: idCard });
    const cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `No se ENCONTRO carrito con el id ${idCart}`
      });
    }
    res.status(200).json({
      status: 'succses',
      payload: cartByID
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: `Not Found: No se ENCONTRO carrito ${error}`
    });
  }
};
const createCartController = async (req, res) => {
  try {
    // const cart = req.body;
    const cart = {};
    // const resNewCart = await cartsModel.create(cart);
    const resNewCart = await CartService.create(cart);
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
const addProductsToCartController = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;

  try {
    // VERIFICO SI EXISTE EL CARRITO
    const cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO carrito con el id ${idCart}`
      });
    }

    // VERIFICO SI EXISTE EL PRODUCTO
    const productByID = await ProductService.getById(idProduct);
    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO el PRODUCTO con el id ${idProduct}`
      });
    }

    // PARA REALIZAR LA ACTUALIZACION
    const existingProduct = cartByID.products.findIndex((item) => {
      // TODO: cambiar a string  item.product._id para poder usar el ===
      return item.product._id == idProduct;
    }
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
    const cartProductUpdate = await CartService.update(cartByID._id, cartByID);
    console.log(cartProductUpdate);
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
// UPDATES
const updateQuantityCartAndProductController = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;

  try {
    // VERIFICO SI EXISTE EL CARRITO
    const cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO carrito con el id ${idCart}`
      });
    }
    const productById = await ProductService.getById(idCart);
    if (!productById) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO el producto con el id ${productById}`
      });
    }

    const existingProduct = cartByID.products.findIndex((item) =>
      item.product._id == idProduct
    );

    if (existingProduct === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'El producto no se encuentra en el carrito'
      });
    }

    const quantity = +req.body.quantity;
    if (!quantity) {
      return res.status(400).json({ status: 'error', message: 'No se encontro la cantidad en las opciones' });
    }
    if (typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', message: 'La cantidad no es numero' });
    }
    if (quantity === 0) {
      return res.status(400).json({ status: 'error', message: 'No se acepta 0 como cantidad' });
    }

    cartByID.products[existingProduct].quantity = quantity;

    // const cartProductUpdate = await cartByID.save();
    const cartProductUpdate = await CartService.updated({ _id: idCart }, cartByID);
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

const updateDataProductCartController = async (req, res) => {
  const idCart = req.params.cid;
  let cartByID = {};

  try {
    // VERIFICO SI EXISTE EL CARRITO
    cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO carrito con el id ${idCart}`
      });
    }

    const dataProducts = req.body.products;
    if (!Array.isArray(dataProducts)) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos del PRODUCTO incorrecto'
      });
    }
    for (let i = 0; i < dataProducts.length; i++) {
      if (!dataProducts[i].hasOwnProperty('product') || !dataProducts[i].hasOwnProperty('quantity')) {
        return res.status(400).json({ status: 'error', message: 'Error propiedaes incrrectas' });
      }
      if (typeof dataProducts[i].quantity !== 'number') {
        return res.status(400).json({ status: 'error', message: 'La cantidad no es numero' });
      }
      if (dataProducts[i].quantity === 0) {
        return res.status(400).json({ status: 'error', message: 'No se acepta 0 como cantidad' });
      }
      const productByID = await ProductService.getById(dataProducts[i].product);
      if (!productByID) {
        return res.status(400).json({ status: 'error', message: 'El producto que desa actualizar no existe' });
      }
    }
    cartByID.products = dataProducts;
    // Guardamos el carrito actualizado
    const updateCart = await CartService.updatedCart({ _id: cartByID }, cartByID);
    // const result = await cartByID.save();

    res.status(200).json({
      status: 'success',
      payload: updateCart
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `No se puedo ACTUALIZAR el producto del carrito: ${error.message}`
    });
  }
};
// DELETES
const deleteProductForCartController = async (req, res) => {
  const idCart = req.params.cid;
  try {
    const cartDelete = await CartService.delete(idCart);
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
const deleteProductSelectCartController = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  try {
    // VERIFICO SI EXISTE EL CARRITO
    const cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO carrito con el id ${idCart}`
      });
    }

    const existingProduct = cartByID.products.findIndex((item) =>
      item.product._id == idProduct
    );

    if (existingProduct !== -1) {
      return res.json({ status: 'error', message: `El producto con el id=${idProduct} en el carrito` });
    }
    // Eliminamos el producto del carrito
    // cartByID.products.filter(product => product._id !== idProduct);
    // cartByID.products = cartByID.products.splice(existingProduct, 1);
    const cartProductUpdate = await CartService.update({ _id: idCart }, cartByID);
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
const finishBuyCartController = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const cart = await CartService.getById(idCart);
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `No se puedo finalizar la compra: ${error.message}`
    });
  }
};

export {
  createCartController,
  getCartByIDController,
  addProductsToCartController,
  updateQuantityCartAndProductController,
  updateDataProductCartController,
  deleteProductForCartController,
  deleteProductSelectCartController,
  finishBuyCartController
};
