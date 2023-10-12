// import CartManager from "../dao/fileManager/CartManager.js";
// const carts = new CartManager("Carts.json");
import { CartService, cartCalculateTotal } from '../services/carts.services.js';
import { ProductService } from '../services/products.service.js';
import crypto from 'node:crypto';
import logger from '../services/logger.js';

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
    const totalcart = await cartCalculateTotal(cartByID);
    // console.log(cartByID);
    cartByID.totalcart = totalcart;
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
    // console.log(cartProductUpdate);
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
  const dataProducts = req.body;
  let cartByID = {};

  try {
    // VERIFICO SI EXISTE EL CARRITO
    // console.log(typeof idCart);
    // console.log('-----body-------');
    // console.log(dataProducts);
    cartByID = await CartService.getById(idCart);
    if (!cartByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se ENCONTRO carrito con el id ${idCart}`
      });
    }

    // const dataProducts = req.body.products;

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
    const updateCart = await CartService.update({ _id: cartByID }, cartByID);
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
      item.product._id.toString() == idProduct
    );
    console.log('holiis' + existingProduct);
    if (existingProduct === -1) {
      return res.json({ status: 'error', message: `El producto con el id=${idProduct} en el carrito` });
    } else {
      // cartByID.products = cartByID.products.splice(+existingProduct, 1);

      cartByID.products = cartByID.products.filter(item => item.product._id.toString() !== idProduct);
    }

    // Eliminamos el producto del carrito
    // cartByID.products.filter(product => product._id !== idProduct);
    // cartByID.products = cartByID.products.splice(existingProduct, 1);
    const cartProductUpdate = await CartService.update({ _id: idCart }, cartByID);
    res.status(200).json({
      status: 'success',
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
    console.log(req.user);
    const userEmail = req.user.email || 'sinNombre';
    const cart = await CartService.getById(idCart);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: `El carrito con ${idCart} no existe` });
    }
    const productAddPurchase = [];
    const productNotPurchase = [];
    // Recorrer cada producto en el carrito
    for (const productCart of cart.products) {
      const productID = productCart.product._id;
      const productCartQuantity = productCart.quantity;
      const product = await ProductService.getById(productID);
      if (!product) {
        // productNotPurchase.push(productCart);
        return res.status(404).json({ status: 'error', message: `El producto con ${productID} no existe` });
      }
      // Verifico cantidad de producto
      if (product.stock === 0 || product.status === false) {
        productNotPurchase.push(productCart);
        continue;
      }

      if (product.stock >= productCartQuantity) {
        product.stock -= productCartQuantity;
        await ProductService.update({ _id: product._id }, product);
        productAddPurchase.push(productCart);
      } else {
        productNotPurchase.push(productCart);
      }
    }

    if (productAddPurchase.length > 0) {
      // Crea un nuevo ticket con los detalles de la compra
      const newTicket = {
        code: crypto.randomBytes(16).toString('hex'),
        purchase_datetime: new Date(),
        amount: await cartCalculateTotal(productAddPurchase),
        purchaser: userEmail,
        products: productAddPurchase.map((prod) => ({
          product: prod.product._id,
          quantity: prod.quantity
        }))
      };
      const saveTicket = await CartService.createPurchase(newTicket);
      console.log(idCart);
      const cartUpdate = await CartService.update(
        { _id: idCart },
        { products: productNotPurchase },
        { returnDocument: 'after' }
      );
      res.status(200).json({
        status: 'success',
        payload: { saveTicket, cartUpdate }
      });
    } else {
      const cartUpdate = await CartService.update(
        { _id: idCart },
        { products: productNotPurchase },
        { returnDocument: 'after' }
      );
      console.log({ cartUpdate });
      res.status(404).json({
        status: 'error',
        payload: cartUpdate,
        message: 'No se pudo realizar la compra '
      });
    }
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
