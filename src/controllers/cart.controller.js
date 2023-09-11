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
    const cart = req.body;
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
    if (!Number.isInteger(quantity) || quantity < 0) {
      // TODO: Mejorar el error
      throw new Error('Cantidad incorrecta');
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
      throw new Error('Producto no encontrado');
    }
    // Eliminamos el producto del carrito
    cartByID.products.splice(existingProduct, 1);
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

export {
  createCartController,
  getCartByIDController,
  addProductsToCartController,
  updateQuantityCartAndProductController,
  updateDataProductCartController,
  deleteProductForCartController,
  deleteProductSelectCartController
};
