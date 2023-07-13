 import ProductManager from "../dao/fileManager/ProductManager.js";
const product = new ProductManager();


const getAllProducts = async (req, res) => {
  // NUEVA IMPLEMNTACION
  try {
    const { productAll} = product.getProductsByID(req);
    res.status(200).json({ status: "success", payload: productAll });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al RETORNAR LISTA de productos: ${error.message}`,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const response = product.getProductsByID(req.params);

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Not Found: No se encontro producto `,
      });
    }
    res.status(200).json({
      status: "succses",
      payload: response,
    });

  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al BUSCAR UN producto por id: ${error}`,
    });
  }
};
const saveProduct = async (req, res) => {
  try {
    const response = product.addProduct(req.body);

    if (response !== null) {   
      const prodcutAll = await productModel.find().lean().exec();
      req.io.emit("updateProducts", prodcutAll);
      res.status(201).json({
        status: "succses",
        payload: prodcutAll,
        message: `Se agrego correctamente el producto ${product.title}`,
      });
    } else {
      res.status(400).send({ status: "error", message: response.message });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al AGREGAR un producto: ${error}`,
    });
  }
};

const updateProduct = async (req, res) => {
  // let idProduct = +req.params.pid;
  try {
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
    // * Decomentar
  //   let idProduct = +req.params.pid;
  //   const result = await productModel.findByIdAndDelete(idProduct);
  //   if (result === null) {
  //     res.status(404).json({
  //       status: "error",
  //       message: `Not Found: No se encontro prudcto con el id ${idProduct}`,
  //     });
  //   }
  //   const prodcutAll = await productModel.find().lean().exec();
  //   req.io.emit("updateProducts", prodcutAll);
  //   res.status(200).json({
  //     status: "succses",
  //     payload: prodcutAll,
  //     message: `Se actualizo correctamente el producto ${idProduct}`,
  //   });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Error al ACTUALIZAR elemento, ${error}`,
    });
  }
};
const deleteProduct = async (req, res) => {
  // let idProduct = +req.params.pid;
  try {
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
    // * Descomentar

    // let idProduct = req.params.pid;
    // const dataProduct = req.body;
    // const result = await productModel.findByIdAndUpdate(
    //   idProduct,
    //   dataProduct,
    //   { returnDocument: "after" }
    // );
    // if (result === null) {
    //   return res.status(404).json({ status: "error", message: "Not Found" });
    // }
    // const prodcutAll = await productModel.find().lean().exec();
    // req.io.emit("updateProducts", prodcutAll);
    // res.status(200).json({
    //   status: "succses",
    //   message: `Se ELIMINO correctamente el producto ${idProduct}`,
    // });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: `Error al ELIMINAR prudcto id: , ${error}`,
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
