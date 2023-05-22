import fs from "fs";

export default class ProductManager {
  #products;
  #error;
  #format;
  #path;

  constructor(path = "./ListProducts.json") {
    this.#error = {
      result: false,
      message: "",
    };
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

  // Restablese el objeto error con unos valores por defecto
  #restarError() {
    this.#error = {
      result: false,
      message: "",
    };
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

    resultSearch
      ? (this.#error.message = `Ya existe el ${code} en el sistema `)
      : (this.#error.result = true);
  }

  //Valida que los campos no esten vacios y si no lo estan invocan el metodo validateCode
  #validateKeys(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      this.#error.message = "No se aceptan campos vacios";
    } else {
      this.#validateCode(code);
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
      console.log(`Error al devolver lista de productos: ${error}`);
    }
    // return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
  }

  async #seveProductFile() {
    try {
      return await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
    } catch (error) {
      return console.log(`Error al gravar producto en el archivo ${error} `);
    }
  }

  // Agrega los campos que recibe al un arreglo en forma de objeto con un nuevo campo llamado id
  async addProduct(title, description, price, thumbnail, code, stock) {
    this.#validateKeys(title, description, price, thumbnail, code, stock);

    if (this.#error.result) {
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

      await this.#seveProductFile();
    } else {
      return console.log(`Error: ${this.#error.message}`);
    }

    this.#restarError();
  }

  // Retorna un array de productos
  async getProductos() {
    try {
      const productsFiles = await fs.promises.readFile(
        this.#path,
        this.#format
      );
      return JSON.parse(productsFiles);
    } catch (error) {
      return console.log(`Error al devolver lista de productos: ${error}`);
    }
  }

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  async getProductosByID(id) {
    try {
      let productsFiles = await this.#getProductsFile();
      let resultadoBusqueda = productsFiles.find(
        (product) => product.id === id
      );

      return resultadoBusqueda;
    } catch (error) {
      return console.log(`Error al obtener Porducto por id ${error}`);
    }
  }

  async updateProduct({ id, ...dataProducts }) {
    try {
      const productsFiles = await this.#getProductsFile();

      const productsUpdate = productsFiles.map((product) => {
        if (product.id === id) {
          let productUpdate = { ...product, ...dataProducts };
          return productUpdate;
        }
        return product;
      });

      this.#products = productsUpdate;
      await this.#seveProductFile();
      return console.log(
        `Se actualizo correctamente el producto con el id ${id}`
      );
    } catch (error) {
      return console.log(`Error al actualizar elemento ${id}, ${error}`);
    }
  }

  async deleteProduct(id) {
    try {
      let productFind = await this.getProductosByID(id);

      if (!productFind) {
        const productsFiles = await this.#getProductsFile();
        let productsDelete = productsFiles.filter(
          (product) => product.id != id
        );

        this.#products = productsDelete;
        await this.#seveProductFile();

        return console.log(
          `Se elimino correctamente el producto con el id ${id}`
        );
      } else {
        return console.log(productFind);
      }
    } catch (error) {
      return console.log(`Error al elimiar elemento ${id}, ${error}`);
    }
  }
}

// const product = new ProductManager("./ListProducts.json");

// // console.log("----- Listado de Productos ------");
// // //  product.getProductos().then(datos =>console.log(datos) );
// await product.getProductos();

// // // console.log("----- Push de Productos ------");
// await product.addProduct(
//   "nike",
//   "Zapatilla Blanca",
//   1000,
//   "Sin imagen",
//   2301,
//   10
// );
// await product.addProduct("Zapatilla Roja", 2000, "Sin imagen", 1235, 1);
// await product.addProduct(
//   "Gola",
//   "Zapatialla verde",
//   1500,
//   "Sin imagen",
//   1235,
//   2
// );
// await product.addProduct("Puma", "Botin negro", 3000, "Sin imagen", 1254, 5);
// await product.addProduct("Gola", "Zapatialla Azul", 500, "Sin imagen", 5896, 2);
// await product.addProduct("Puma", "Botin Gris", 3000, "Sin imagen", 3524, 5);

// // console.log("----- Eliminacion de Productos ------");
// await product.deleteProduct(2);
// await product.deleteProduct(3);
// await product.deleteProduct(4);
// await product.deleteProduct(15);

// // console.log("----- Actualizacion de Productos ------");
// await product.updateProduct({ id: 231, title: "Otra maraca ", price: 30 });

// // console.log("----- Listado de Productos ------");
// product.getProductos();

// // console.log("----- Filtro de Productos ------");

// console.log(await product.getProductosByID(6));
