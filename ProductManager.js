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
    this.#products =  [];
    this.#initialFileProduct();
    
   
  }


   #initialFileProduct(){
    let contentFile;

    if(fs.existsSync(this.#path)){
      let fileProducts =  fs.readFileSync(this.#path, this.#format);

      if(fileProducts.toString() === ''){
        fs.writeFileSync(this.#path,'[]');
      }
      else {
        this.#products = JSON.parse( fs.readFileSync(this.#path, this.#format))
      }

    }else{
      contentFile = fs.writeFileSync(this.#path,'[]');
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

    const ListProducts = await fs.promises.readFile(this.#path, this.#format);
    return JSON.parse( ListProducts );
    
  }

  async #seveProductFile() {
    return await fs.promises.writeFile(
      this.#path,
      JSON.stringify(this.#products, null, "\t")
    );
  }

  // Agrega los campos que recibe al un arreglo en forma de objeto con un nuevo campo llamado id
 async addProduct(title, description, price, thumbnail, code, stock) {
    console.log(this.#products);
    this.#validateKeys(title, description, price, thumbnail, code, stock);

    if (this.#error.result) {
      this.#products.push({
        id: this.#generateID(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      
      await this.#seveProductFile();
      console.log(`Se agrego efectivamente el producto : ${title}`);

    } else {
      console.log(`Error: ${this.#error.message}`);
    }

    this.#restarError();
  }

  // Retorna un array de productos
   async getProductos() {
    const productsFiles = await this.#getProductsFile();
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

  async updateProduct({id, ...dataProducts}){
    const productsFiles = await this.#getProductsFile();
    const productsUpdate = productsFiles.map(product => {

        if(product.id === id){
         let productUpdate =  { ...product, ...dataProducts };
         return productUpdate;
        }
        return product;
    });
    this.#products = productsUpdate;
    this.#seveProductFile();

  }

  async deleteProduct(id){
    const productsFiles = await this.#getProductsFile();
    const productsDelete= productsFiles.filter(product => {product.id !== id
    });
    console.log(productsDelete);
    this.#products = productsDelete;
    this.#seveProductFile();
  }
}

const product = new ProductManager("./ListProducts.json");

// // // console.log("----- Listado de Productos ------");
// //  product.getProductos().then(datos =>console.log(datos) );
 product.getProductos();

// console.log("----- Push de Productos ------");
product.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// product.updateProduct(
//   {id: 1,
//   title: "producto ",
//   detalle: "Este "}
// );

// product.deleteProduct(1);
// product.addProduct(
//   "producto prueba 2",
//   "Este es un producto prueba 2",
//   20,
//   "Sin imagen",
//   "abc122",
//   25
// );

// product.addProduct(
//   "producto prueba",
//   "Este es un producto prueba",
//   200,
//   "Sin imagen",
//   "abc123",
//   25
// );

// product.addProduct(
//   "producto prueba 3",
//   "Este es un producto prueba 3",
//   2,
//   "Sin imagen",
//   "abc124",
//   25
// );

// console.log("----- Listado de Productos ------");
// console.log(product.getProductos());

// console.log("----- Filtro de Productos ------");
// console.log(product.getProductosByID(12));

// console.log(product.getProductosByID(1));
