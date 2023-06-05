import { log } from "console";
import fs from "fs";

export default class ProductManager {
  #products;
  #format;
  #path;

  constructor(path = "../../ProductManager.json") {
    this.#path = path;
    this.#format = "utf-8";
    this.#products = [];
    this.#initialFileProduct();
  }

  #initialFileProduct() {
    if (fs.existsSync(this.#path)) {
      let fileProducts = fs.readFileSync(this.#path, this.#format);

      if (fileProducts.toString() === "") {
        return fs.writeFileSync(this.#path, "[]");
      } else {
        return (this.#products = JSON.parse(
          fs.readFileSync(this.#path, this.#format)
        ));
      }
    } else {
      return fs.writeFileSync(this.#path, "[]");
    }
  }

  // Genera el id para los productos de marena incremental
  #generateID() {
    return this.#products.length === 0
      ? 1
      : this.#products[this.#products.length - 1].id + 1;
  }

  // Verifica si el el contenido de code no se encuetra repetido
  #validateCode(code) {
    const resultSearch = this.#products.find(
      (product) => product.code === code
    );

    return resultSearch
      ? { error: true, message: `Ya existe el ${code} en el sistema ` }
      : { error: false };
  }

  //Valida que los campos no esten vacios y si no lo estan invocan el metodo validateCode
  #validateKeys(title, description, price, code, stock) {
    if (!title || !description || !price || !code || !stock) {
      return { error: true, message: "No se aceptan campos vacios" };
    } else {
      return this.#validateCode(code);
    }
  }

  async #getProductsFile() {
    try {
      const productsFiles = await fs.promises.readFile(
        this.#path,
        this.#format
      );
      return JSON.parse(productsFiles);
    } catch (error) {
      return { message: `Error al devolver lista de productos: ${error}` };
    }
    // return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
  }

  async #seveProductFile() {
    try {
      const repuesta = await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
      return repuesta;
    } catch (error) {
      return { message: `Error al grabar producto en el archivo ${error} ` };
    }
  }

  // Agrega los campos que recibe al un arreglo en forma de objeto con un nuevo campo llamado id
  async addProduct(title, description, price, thumbnail, code, stock) {
    const responseValidat = this.#validateKeys(
      title,
      description,
      price,
      code,
      stock
    );
    if (!responseValidat.error) {
      let newProduct = {
        id: this.#generateID(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.#products.push(newProduct);
      return await this.#seveProductFile();
    } else {
      // return { status: "error", message: `${responseValidat.message}` };
      return responseValidat;
    }
  }

  // Retorna un array de productos
  async getAllProductos() {
    // try {
    const productsFiles = await fs.promises.readFile(this.#path, this.#format);
    return JSON.parse(productsFiles);
    // } catch (error) {
    //   return { error: `Error al devolver lista de productos: ${error}` };
    // }
  }

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  async getProductsByID(id) {
    // try {
    let productsFiles = await this.getAllProductos();
    let resultadoBusqueda = productsFiles.find((product) => product.id === id);
    return resultadoBusqueda;
    // } catch (error) {
    //   return { message: `Error al obtener Porducto por id ${error}` };
    // }
  }

  async updateProduct({ id, ...dataProducts }) {
    const productsFiles = await this.#getProductsFile();

    const productsUpdate = productsFiles.map((product) => {
      if (product.id === id) {
        let productUpdate = { ...product, ...dataProducts };
        return productUpdate;
      }
      return product;
    });

    this.#products = productsUpdate;
    return await this.#seveProductFile();
    // return {
    //   message: `Se actualizo correctamente el producto con el id ${id}`,
    // };
  }

  async deleteProduct(id) {
    // try {
    let productFind = await this.getProductosByID(id);

    if (!productFind) {
      const productsFiles = await this.#getProductsFile();
      let productsDelete = productsFiles.filter((product) => product.id != id);

      this.#products = productsDelete;
      await this.#seveProductFile();

      return console.log(
        `Se elimino correctamente el producto con el id ${id}`
      );
    } else {
      return console.log(productFind);
    }
    // } catch (error) {
    //   return { message: `Error al elimiar elemento ${id}, ${error}` };
    // }
  }
}
