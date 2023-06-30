import fs from "fs";

export default class CartManager {
  #carts;
  #format;
  #path;

  constructor(path = "Carts.json") {
    this.#path = path;
    this.#format = "utf-8";
    this.#carts = [];
    this.#initialFileCart();
  }

  #initialFileCart() {
    if (fs.existsSync(this.#path)) {
      let fileCarts = fs.readFileSync(this.#path, this.#format);
      if (fileCarts.toString() === "") {
        return fs.writeFileSync(this.#path, "[]");
      } else {
        return (this.#carts = JSON.parse(
          fs.readFileSync(this.#path, this.#format)
        ));
      }
    } else {
      return fs.writeFileSync(this.#path, "[]");
    }
  }

  // Genera el id para los productos de marena incremental
  #generateID = () => {
    // const carts = await this.getAllCarts();
    console.log(this.#carts.length);
    return this.#carts.length === 0
      ? 1
      : this.#carts[this.#carts.length - 1].id + 1;
  };

  #seveCartsFile = async () => {
    try {
      const repuesta = await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#carts, null, "\t")
      );
      return repuesta;
    } catch (error) {
      return { message: `Error al grabar carts en el archivo ${error} ` };
    }
  };

  newCart = async () => {
    let id = this.#generateID();
    let product = [];
    this.#carts.push({ id, product });
    return await this.#seveCartsFile();
  };

  getAllCarts = async () => {
    const cartsFiles = await fs.promises.readFile(this.#path, this.#format);
    return JSON.parse(cartsFiles);
  };

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  getCartByID = async (id) => {
    let cartsFiles = await this.getAllCarts();
    let resultadoBusqueda = cartsFiles.find((cart) => cart.id === id);
    return resultadoBusqueda;
  };

  addProductsToCart = async (cartID, productId) => {
    // Obtener el carrito por ID
    const cart = await this.getCartByID(cartID);

    if (!cart) {
      return res
        .status(404)
        .json({ error: `El carrito con el id ${cartID} no existe` });
    }

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.product.find(
      (products) => products.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity++; // Incrementar la cantidad del producto
    } else {
      // Agregar el producto al carrito
      const product = {
        product: productId,
        quantity: 1,
      };
      cart.product.push(product);
    }

    // Actualizar el carrito en el arreglo "carts"
    const cartIndex = this.#carts.findIndex((cart) => cart.id === cartID);
    if (cartIndex !== -1) {
      this.#carts[cartIndex] = cart;
    }

    return await this.#seveCartsFile();
  };
}
