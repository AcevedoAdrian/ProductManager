// import ProductManager from "../services/ProductManager.js";
// const product = new ProductManager("ProductManager.json");
import productModel from "../dao/models/products.model.js";

const getAllProducts = async (req, res) => {
  // NUEVA IMPLEMNTACION
  try {
    // PREGUNTO SI LOS PARAMETROS SON NULL, UNDEFINED
    const productByLimit = +req.query.limit || 10;
    const productByPage = +req.query.page || 1;
    const productAvailability = +req.query.stock || "";
    const productBySort = req.query.sort ?? "asc";
    const productByCategory = req.query.category || "";

    let productFilter = {};
    if (req.query.category) {
      productFilter = { category: productByCategory };
    }
    if (req.query.stock) {
      productFilter = { ...filter, stock: productAvailability };
    }
    // ORDENO POR DES SOLO SI ASI VIENE POR PARAMETRO CASO CONTRARIO ORDENO POR LO QUE SEA ASC
    let optionsPrice = {};
    if (productBySort === "desc") {
      optionsPrice = { price: -1 };
    } else {
      optionsPrice = { price: 1 };
    }

    const optionsLimit = {
      limit: productByLimit,
      page: productByPage,
      sort: optionsPrice,
    };
    console.log(optionsLimit);
    console.log(productFilter);
    const productAll = await productModel.paginate(productFilter, optionsLimit);
    console.log(productAll);

    const payload = productAll.docs;
    const totalPages = productAll.totalPages;
    const prevPage = productAll.prevPage;
    const nextPage = productAll.nextPage;
    const page = productAll.page;
    const hasPrevPage = productAll.hasPrevPage;
    const hasNextPage = productAll.hasNextPage;
    const prevLink = hasPrevPage
      ? `/api/product?page=${prevPage}&limit${productByLimit}`
      : ``;
    const nextLink = hasNextPage
      ? `/api/product?page=${nextPage}&limit${productByLimit}`
      : ``;
    res.status(200).json({
      status: "success",
      payload,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al RETORNAR LISTA de productos: ${error.message}`,
    });
  }
};
const getProductById = async (req, res) => {
  let idProduct = req.params.pid;
  try {
    let productByID = await productModel.findById(idProduct).lean().exec();

    if (!productByID) throw new Error();

    return res.status(200).json({
      status: "succses",
      payload: productByID,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
    });
  }
};

// POST: GUARDA LOS DATOS DE REQ.BODY EN LA BASE DE DATOS
const saveProduct = async (req, res) => {
  try {
    const product = req.body;
    const resAddProduct = await productModel.create(product);
    if (resAddProduct !== null) {
      const prodcutAll = await productModel.find().lean().exec();
      req.io.emit("updateProducts", prodcutAll);
      res.status(201).json({
        status: "succses",
        payload: prodcutAll,
        message: `Se agrego correctamente el producto ${product.title}`,
      });
    } else {
      res.status(400).send({ status: "error", message: resAddProduct.message });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al AGREGAR un producto: ${error.message}`,
    });
  }
};

const updateProduct = async (req, res) => {
  const idProduct = req.params.pid;
  // FINDBYID: PARA SABER SI EXISTE EL PRODUCTO
  try {
    await productModel.findById(idProduct).exec();
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
    });
  }
  // UPDATEONE: ACTUALIZO EL PRODUCTO CON EL ID DE PARAMS
  try {
    const dataProductUpdate = req.body;
    const responseUpdate = await productModel.updateOne(
      { _id: idProduct },
      dataProductUpdate
    );
    // const responseUpdate = await productModel.findByIdAndUpdate(
    //   idProduct,
    //   dataProduct,
    //   { returnDocument: "after" }
    // );
    //acknowledged: SI ES TRUE SE REALIZO LA ACTULIZACION CON EXITO
    if (responseUpdate.acknowledged === false) throw new Error();
    //? tambien pude se asi
    //acknowledged: SI ES FALSE REPONDE CON ERROR
    // return res.status(404).json({
    //   status: "error",
    //   message: `Error algunos campos no son validos`,
    // });
    // SI NO HUBO ERROR
    const prodcutAll = await productModel.find().lean().exec();
    req.io.emit("updateProducts", prodcutAll);
    return res.status(200).json({
      status: "succses",
      payload: prodcutAll,
      message: `Se actualizo correctamente el producto ${idProduct}`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Error al ACTUALIZAR elemento ${idProduct}, ${error.message}`,
    });
  }
};
const deleteProduct = async (req, res) => {
  const idProduct = req.params.pid;
  // FINDBYID: PARA SABER SI EXISTE EL PRODUCTO
  try {
    await productModel.findById(idProduct).exec();
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
    });
  }

  try {
    await productModel.deleteOne({ _id: idProduct });
    const prodcutAll = await productModel.find().lean().exec();
    req.io.emit("updateProducts", prodcutAll);
    res.status(200).json({
      status: "succses",
      message: `Se ELIMINO correctamente el producto ${idProduct}`,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: `Error al ELIMINAR prudcto id: ${idProduct}, ${error.message}`,
    });
  }
};

export {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
};
