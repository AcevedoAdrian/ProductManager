
import productModel from '../models/products.model.js';
import { ProductService } from '../services/products.service..js';
import { CartService } from '../services/carts.services.js';
import { serverSocketio } from '../utils/serverSocketio.js';
import logger from '../services/logger.js';
// const productManager = new ProductManager("./ProductManager.json");

const viewAllProductsController = async (req, res) => {
  try {
    // PREGUNTO SI LOS PARAMETROS SON NULL, UNDEFINED
    // logger.info(req.query);
    const productsAll = await ProductService.getAllPaginate(req);
    const user = req.user;
    res.render('products/products', { productsAll, user });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `Error al RETORNAR LISTA de productos: ${error.message}`
    });
  }
};

const viewRealTimeAllProductsController = async (req, res) => {
  try {
    const io = req.app.get('socketio');
    serverSocketio(io);
    const products = await ProductService.getAllPaginate(req);
    res.render('products/realTimeProducts', { products });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

const viewProductByIdController = async (req, res) => {
  const idProduct = req.params.pid;
  try {
    const productByID = await productModel.findById(idProduct).lean().exec();

    if (productByID === null) {
      return res
        .status(404)
        .json({ status: 'error', message: 'El producto no existe' });
    }
    res.render('product', { productByID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};

const viewCartByIDController = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const cartByID = await CartService.getById(idCart);
    console.log(!cartByID);
    if (!cartByID) {
      return res.render('cart', { errror: 'El carrito no existe' });
    }

    const cart = cartByID.products;
    res.render('cart', { cart });
  } catch (error) {
    logger.error(error.message);
    res
      .status(500)
      .json({ status: 'error', message: error.message });
  }
};

export {
  viewAllProductsController,
  viewRealTimeAllProductsController,
  viewProductByIdController,
  viewCartByIDController
};
