import fs from "fs";

class ProductManager {
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
    // this.#initialFileProduct();
  }

  // #initialFileProduct() {
  //   if (fs.existsSync(this.#path)) {
  //     let fileProducts = fs.readFileSync(this.#path, this.#format);
  //     if (fileProducts.toString() === "") {
  //       fs.writeFileSync(this.#path, "[]");
  //     } else {
  //       this.#products = JSON.parse(fs.readFileSync(this.#path, this.#format));
  //     }
  //   } else {
  //     fs.writeFileSync(this.#path, "[]");
  //   }

  // }

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
    return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
  }

  async #seveProductFile() {
    return await fs.promises.writeFile(
      this.#path,
      JSON.stringify(this.#products, null, "\t")
    );
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
      return console.log(`Se agrego efectivamente el producto : ${title}`);
    } else {
      return console.log(`Error: ${this.#error.message}`);
    }

    this.#restarError();
  }

  // Retorna un array de productos
  async getProductos() {
    const productsFiles = JSON.parse(
      await fs.promises.readFile(this.#path, this.#format)
    );
    return console.log(productsFiles);
  }

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  async getProductosByID(id) {
    const productsFiles = await this.#getProductsFile();
    const resultadoBusqueda = productsFiles.find(
      (product) => product.id === id
    );
    return resultadoBusqueda ?? `Not found`;
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
    await this.#seveProductFile();
  }

  async deleteProduct(id) {
    let productFind = await this.getProductosByID(id);

    if (productFind !== "Not found") {
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
  }
}

const product = new ProductManager("./ListProducts.json");

// console.log("----- Listado de Productos ------");
// //  product.getProductos().then(datos =>console.log(datos) );
// product.getProductos();

// // console.log("----- Push de Productos ------");
// product.addProduct("nike", "Zapatilla Blanca", 1000, "Sin imagen", "02301", 10);
// product.addProduct("adidas ", "Zapatilla Roja", 2000, "Sin imagen", "01235", 1);
// product.addProduct("Gola", "Zapatialla verde", 1500, "Sin imagen", "1235", 2);
// product.addProduct("Puma", "Botin negro", 3000, "Sin imagen", "01254", 5);

// console.log("----- Eliminacion de Productos ------");
// product.deleteProduct(3);

// console.log("----- Actualizacion de Productos ------");
// product.updateProduct({ id: 1, title: "nike ", price: 30 });

// console.log("----- Listado de Productos ------");
// product.getProductos();

// console.log("----- Filtro de Productos ------");
// product.getProductosByID(12);
console.log(product.getProductosByID(1));
