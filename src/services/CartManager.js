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
      console.log("EXISTE EL ARCHIVO");
      let fileCarts = fs.readFileSync(this.#path, this.#format);
      if (fileCarts.toString() === "") {
        return fs.writeFileSync(this.#path, "[]");
      } else {
        return (this.#carts = JSON.parse(
          fs.readFileSync(this.#path, this.#format)
        ));
      }
    } else {
      console.log("NO EXISTE EL ARCHIVO");
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

  async #getCartsFile() {
    try {
      const cartsFiles = await fs.promises.readFile(this.#path, this.#format);
      return JSON.parse(cartsFiles);
    } catch (error) {
      return { message: `Error al devolver lista del carrito: ${error}` };
    }
    // return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
  }

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

  newCart = async (idCart) => {
    let id = this.#generateID();
    let product = [];
    this.#carts.push({ id, product });
    await this.#seveCartsFile();
  };
  getAllCarts = async () => {
    const cartsFiles = await fs.promises.readFile(this.#path, this.#format);
    return JSON.parse(cartsFiles);
  };

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  getCartByID = async (id) => {
    let cartsFiles = await this.getAllCarts();
    let resultadoBusqueda = cartsFiles.find((cart) => cart.id === id);
    console.log(resultadoBusqueda);
    return resultadoBusqueda;
  };

  addProductsToCart = async (cartId, productId) => {
    //
    let carts = await this.getAllCarts();

    // Verificar si el producto ya existe en el carrito
    const existingProduct = carts.find((products) => products.id === productId);

    if (existingProduct) {
      existingProduct.quantity++; // Incrementar la cantidad del producto
    } else {
      // Agregar el producto al carrito
      const product = {
        id: productId,
        quantity: 1,
      };
      carts.products.push(product);
    }

    // Actualizar el carrito en el arreglo "carts"
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      this.#carts[cartIndex] = carts;
    }

    await this.#seveCartsFile();
  };
}
