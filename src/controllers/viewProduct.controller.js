// import ProductManager from "../dao/fileManager/ProductManager.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";

// const productManager = new ProductManager("./ProductManager.json");

const renderAllProducts = async (req, res) => {
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
    const productsAll = await productModel.paginate(
      productFilter,
      optionsLimit
    );

    res.render("products", { productsAll });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: `Error al RETORNAR LISTA de productos: ${error.message}`,
    });
  }
};

const renderRealTimeAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

const viewProductById = async (req, res) => {
  const idProduct = req.params.pid;
  try {
    const productByID = await productModel.findById(idProduct).lean().exec();

    if (productByID === null) {
      return res
        .status(404)
        .json({ status: "error", message: `El producto no existe` });
    }
    res.render("product", { productByID });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

const viewCartByID = async (req, res) => {
  const idCart = req.params.cid;
  try {
    const cartByID = await cartModel.findById(idCart).lean().exec();

    if (cartByID === null || cartByID.products.length === 0) {
      const emptyCart = "Cart Empty";
      // req.app.get("socketio").emit("updatedCarts", cart.products);
      return res.render("carts", { emptyCart });
    }
    const cart = cartByID.products;
    // req.app.get("socketio").emit("updatedCarts", carts);

    res.render("cart", { cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export {
  renderAllProducts,
  renderRealTimeAllProducts,
  viewProductById,
  viewCartByID,
};
