
import { ProductService } from '../services/products.service.js';

const getAllProductsController = async (req, res) => {
  // NUEVA IMPLEMNTACION
  try {
    const result = await ProductService.getAllPaginate(req);
    res.status(200).json({
      status: 'success',
      result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error al RETORNAR LISTA de productos: ${error.reason} ${error.message}`
    });
  }
};
const getProductByIdController = async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const productByID = await ProductService.getById(idProduct);
    console.log(productByID);

    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`
      });
    }

    return res.status(200).json({
      status: 'succses',
      payload: productByID
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `Error al procesar getProductById: ${error.reason}  ${error.message}`
    });
  }
};

// POST: GUARDA LOS DATOS DE REQ.BODY EN LA BASE DE DATOS
const createProductController = async (req, res) => {
  try {
    let thumbnail = [];
    const {
      title,
      description,
      price,
      code,
      stock,
      category
    } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
      return res.status(400).json({ status: 'error', message: 'Error al AGREGAR un producto: No se aceptan campos vacios' });
    }
    if (req.files) {
      thumbnail = req.files.map(file => file.filename);
    }
    const product = { title, description, price, code, stock, category, thumbnail };

    const resAddProduct = await ProductService.create(product);

    if (resAddProduct !== null) {
      const prodcutAll = await ProductService.getAll();
      const io = req.app.get('socketio');
      io.emit('updateProducts', prodcutAll);
      res.status(200).json({
        status: 'succses',
        payload: resAddProduct,
        message: `Se agrego correctamente el producto ${product.title}`
      });
    } else {
      res.status(400).json({ status: 'error', message: `Error al AGREGAR un producto: ${{ resAddProduct }} ` });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error al AGREGAR un producto: ${error.reason} ${error.message}`
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    // FINDBYID: PARA SABER SI EXISTE EL PRODUCTO
    const idProduct = req.params.pid;
    const productByID = await ProductService.getById(idProduct);
    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`
      });
    }

    // UPDATEONE: ACTUALIZO EL PRODUCTO CON EL ID DE PARAMS
    const dataProductUpdate = req.body;

    const responseUpdate = await ProductService.update(idProduct, dataProductUpdate);

    if (!responseUpdate) {
      return res.status(404).json({
        status: 'error',
        message: `Error al ACTUALIZAR el producto ${idProduct} algunos campos no son validos`
      });
    }
    // SI NO HUBO ERROR
    const prodcutAll = await ProductService.getAll();
    const io = req.app.get('socketio');
    io.emit('updateProducts', prodcutAll);
    return res.status(200).json({
      status: 'succses',
      payload: responseUpdate,
      message: `Se actualizo correctamente el producto ${idProduct}`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: `Error al ACTUALIZAR un producto:${error.reason}  ${error.message}`
    });
  }
};
const deleteProductController = async (req, res) => {
  try {
    // FINDBYID: PARA SABER SI EXISTE EL PRODUCTO
    const idProduct = req.params.pid;
    const productByID = await ProductService.getById(idProduct);
    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`
      });
    }

    const productDelete = await ProductService.delete(idProduct);
    if (!productDelete) {
      return res.status(400).json({
        status: 'error',
        message: `Error: No se puedo ELIMINAR el producto con el id ${idProduct}`
      });
    }
    const prodcutAll = await ProductService.getAll();
    const io = req.app.get('socketio');
    io.emit('updateProducts', prodcutAll);
    res.status(200).json({
      status: 'succses',
      message: `Se ELIMINO correctamente el producto ${idProduct}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 'error',
      message: `Error al ELIMINAR prudcto ${error.reason} ${error.message}`
    });
  }
};

export {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
};
