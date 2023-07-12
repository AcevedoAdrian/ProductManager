import productModel from "../dao/models/products.model.js";

export default class ProductManager {
  #products;
  #format;
  #path;

  constructor() {
    this.#products = [];
  }

  #initialFileProduct() {}

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

  async #getAllProductos({ query }) {
    try {
      const productByLimit = query.limit ?? 10;
      const productByPage = query.page ?? 1;
      const productBySort = query.sort === "asc" ? 1 : -1;
      const prodcutByQuery = query.query ?? {};
      const productAll = await productModel.paginate(prodcutByQuery, {
        productByLimit,
        productByPage,
        productBySort,
        lean: true,
      });
      const payload = productAll.docs;
      const totalPages = productAll.totalPages;
      const prevPage = productAll.prevPage;
      const nextPage = productAll.nextPage;
      const page = productAll.page;
      const hasPrevPage = productAll.hasPrevPage;
      const hasNextPage = productAll.hasNextPage;
      const prevLink = productAll.hasPrevPage
        ? `/product?page=${productAll.prevPage}&limit${productByLimit}`
        : ``;
      const nextLink = productAll.hasNextPage
        ? `/product?page=${productAll.nextPage}&limit${productByLimit}`
        : ``;

      return {
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      return { message: `Error al devolver lista de productos: ${error}` };
    }
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
  async addProduct({title, description, price, thumbnail, code, stock}) {
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
      return responseValidat;
    }
  }

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  async getProductsByID({pid}) {
    try{
      let idProduct = pid;
      let productByID = await productModel.findById(idProduct).lean().exec();
      return productByID;
    }catch(error){
      return error
    }
  }

  async updateProduct(id, dataProducts) {
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
  }

  async deleteProduct(id) {
    const productsFiles = await this.#getProductsFile();
    let productsDelete = productsFiles.filter((product) => product.id != id);
    this.#products = productsDelete;
    return await this.#seveProductFile();
  }
}
