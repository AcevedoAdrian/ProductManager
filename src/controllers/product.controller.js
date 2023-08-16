// import ProductManager from "../services/ProductManager.js";
// const product = new ProductManager("ProductManager.json");
import productModel from '../dao/models/products.model.js';

const getAllProductsController = async (req, res) => {
  // NUEVA IMPLEMNTACION
  try {
    // PREGUNTO SI LOS PARAMETROS SON NULL, UNDEFINED
    const productByLimit = +req.query.limit || 10;
    const productByPage = +req.query.page || 1;
    const productAvailability = +req.query.stock || '';
    const productBySort = req.query.sort ?? 'asc';
    const productByCategory = req.query.category || '';

    let productFilter = {};
    if (req.query.category) {
      productFilter = { category: productByCategory };
    }
    if (req.query.stock) {
      productFilter = { ...productFilter, stock: productAvailability };
    }
    // ORDENO POR DES SOLO SI ASI VIENE POR PARAMETRO CASO CONTRARIO ORDENO POR LO QUE SEA ASC
    let optionsPrice = {};
    if (productBySort === 'desc') {
      optionsPrice = { price: -1 };
    } else {
      optionsPrice = { price: 1 };
    }

    const optionsLimit = {
      limit: productByLimit,
      page: productByPage,
      sort: optionsPrice
    };
    const productAll = await productModel.paginate(productFilter, optionsLimit);

    const payload = productAll.docs;
    const totalPages = productAll.totalPages;
    const prevPage = productAll.prevPage;
    const nextPage = productAll.nextPage;
    const page = productAll.page;
    const hasPrevPage = productAll.hasPrevPage;
    const hasNextPage = productAll.hasNextPage;
    const prevLink = hasPrevPage
      ? `/api/product?page=${prevPage}&limit${productByLimit}`
      : '';
    const nextLink = hasNextPage
      ? `/api/product?page=${nextPage}&limit${productByLimit}`
      : '';
    res.status(200).json({
      status: 'success',
      payload,
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
      message: `Error al RETORNAR LISTA de productos: ${error.reason} ${error.message}`
    });
  }
};
const getProductByIdController = async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const productByID = await productModel.findById(idProduct).lean().exec();
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
      return res.status(400).send({ status: 'error', message: 'Error al AGREGAR un producto: No se aceptan campos vacios' });
    }
    if (req.files) {
      thumbnail = req.files.map(file => file.filename);
    }
    const product = { title, description, price, code, stock, category, thumbnail };

    const resAddProduct = await productModel.create(product);
    if (resAddProduct !== null) {
      const prodcutAll = await productModel.find().lean().exec();
      req.io.emit('updateProducts', prodcutAll);
      res.status(200).json({
        status: 'succses',
        payload: prodcutAll,
        message: `Se agrego correctamente el producto ${product.title}`
      });
    } else {
      res.status(400).send({ status: 'error', message: `Error al AGREGAR un producto: ${{ resAddProduct }} ` });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      message: `Error al AGREGAR un producto: ${error.reason} ${error.message}`
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    // FINDBYID: PARA SABER SI EXISTE EL PRODUCTO
    const idProduct = req.params.pid;
    const productByID = await productModel.findById(idProduct).exec();
    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`
      });
    }

    // UPDATEONE: ACTUALIZO EL PRODUCTO CON EL ID DE PARAMS
    const dataProductUpdate = req.body;
    // const responseUpdate = await productModel.updateOne(
    //   { _id: idProduct },
    //   dataProductUpdate
    // );
    const responseUpdate = await productModel.findByIdAndUpdate(
      idProduct,
      dataProductUpdate,
      { returnDocument: 'after' }
    );
    console.log(responseUpdate);
    if (!responseUpdate) {
      return res.status(404).json({
        status: 'error',
        message: `Error al ACTUALIZAR el producto ${idProduct} algunos campos no son validos`
      });
    }
    // SI NO HUBO ERROR
    const prodcutAll = await productModel.find().lean().exec();
    req.io.emit('updateProducts', prodcutAll);
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
    const productByID = await productModel.findById(idProduct).exec();
    console.log(productByID);
    if (!productByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`
      });
    }

    const productDelete = await productModel.deleteOne({ _id: idProduct });
    console.log(productDelete);
    if (!productDelete) {
      return res.status(400).json({
        status: 'error',
        message: `Error: No se puedo ELIMINAR el producto con el id ${idProduct}`
      });
    }
    const prodcutAll = await productModel.find().lean().exec();
    req.io.emit('updateProducts', prodcutAll);
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
