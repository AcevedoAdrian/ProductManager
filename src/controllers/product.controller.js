// import ProductManager from "../services/ProductManager.js";
// const product = new ProductManager("ProductManager.json");
import productModel from "../dao/models/products.model.js";

const getAllProducts = async (req, res) => {
  try {
    let productByLimit = req.query.limit ?? false;
    //Pide todos los productos al ProductManager
    // let prodcutAll = await product.getAllProductos();
    // if (productByLimit) {
    //   let limit = +productByLimit;
    //   res.send({ status: "succses", payload: prodcutAll.slice(0, limit) });
    // } else {
    //   res.json({ status: "succses", payload: prodcutAll });
    // }

    let prodcutAll = await productModel
      .find()
      .limit(productByLimit)
      .lean()
      .exec();
    res.status(200).json({ status: "success", payload: prodcutAll });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al RETORNAR LISTA de productos: ${error.message}`,
    });
  }
};
const getProductById = async (req, res) => {
  try {
    let idProduct = +req.params.pid;
    // let productByID = await product.getProductsByID(idProduct);
    // if (!productByID) {
    //   res.status(404).send({
    //     status: "error",
    //     message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
    //   });
    // } else {
    //   res.send({
    //     status: "succses",
    //     payload: productByID,
    //   });
    // }
    let productByID = await productModel.findById(idProduct).lean().exec();
    if (!productByID) {
      return res.status(404).json({
        status: "error",
        message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
      });
    }
    res.status(200).json({
      status: "succses",
      payload: productByID,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al BUSCAR UN producto por id: ${error}`,
    });
  }
};
const saveProduct = async (req, res) => {
  // console.log(req.body.file);
  try {
    // let { title, description, price, thumbnail, code, stock } = req.body;
    // let resAddProduct = await product.addProduct(
    //   title,
    //   description,
    //   price,
    //   (thumbnail = req.files || []),
    //   code,
    //   stock
    // );
    const product = req.body;
    const resAddProduct = await productModel.create(product);
    console.log("-------");
    console.log(resAddProduct);

    // if (!resAddProduct) {
    //   let prodcutAll = await product.getAllProductos();
    //   console.log(prodcutAll);
    //   req.io.emit("updateProducts", prodcutAll);
    //   res.send({
    //     status: "succses",
    //     message: `Se agrego correctamente el producto ${title}`,
    //   });
    // } else {
    //   res.status(400).send({ status: "error", message: resAddProduct.message });
    // }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al AGREGAR un producto: ${error}`,
    });
  }
};

const updateProduct = async (req, res) => {
  // let idProduct = +req.params.pid;
  // try {
  //   let content = req.body;
  //   let idProduct = +req.params.pid;
  //   let productByID = await product.getProductsByID(idProduct);
  //   if (!productByID) {
  //     res.status(404).send({
  //       status: "error",
  //       message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
  //     });
  //   } else {
  //     let resUpdateProduct = await product.updateProduct(idProduct, content);
  //     if (!resUpdateProduct) {
  //       let prodcutAll = await product.getAllProductos();
  //       console.log(prodcutAll);
  //       req.io.emit("updateProducts", prodcutAll);
  //       res.send({
  //         status: "succses",
  //         message: `Se actualizo correctamente el producto ${idProduct}`,
  //       });
  //     } else {
  //       res
  //         .status(400)
  //         .send({ status: "error", message: resUpdateProduct.message });
  //     }
  //   }
  // } catch (error) {
  //   return res.status(500).send({
  //     status: "error",
  //     message: `Error al ACTUALIZAR elemento ${idProduct}, ${error}`,
  //   });
  // }
};
const deleteProduct = async (req, res) => {
  // let idProduct = +req.params.pid;
  // try {
  //   let productByID = await product.getProductsByID(idProduct);
  //   if (!productByID) {
  //     res.status(404).send({
  //       status: "error",
  //       message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
  //     });
  //   } else {
  //     let resDelete = await product.deleteProduct(idProduct);
  //     if (!resDelete) {
  //       let prodcutAll = await product.getAllProductos();
  //       console.log(prodcutAll);
  //       req.io.emit("updateProducts", prodcutAll);
  //       res.send({
  //         status: "succses",
  //         message: `Se ELIMINO correctamente el producto ${idProduct}`,
  //       });
  //     } else {
  //       res.send({
  //         status: "Error",
  //         message: `No se pudo ELIMINAR correctamente el producto ${idProduct}`,
  //       });
  //     }
  //   }
  // } catch (error) {
  //   return res.status(500).send({
  //     status: "error",
  //     message: `Error al ELIMINAR prudcto id: ${idProduct}, ${error}`,
  //   });
  // }
};

export {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
};
