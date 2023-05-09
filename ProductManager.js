class ProductManager{ 
  #products
  #error

  constructor(){
    this.#products = [];
    this.#error = {
      result: false,
      message:''
    }
  }

  // Restablese el objeto error con unos valores por defecto
  #restarError(){
    this.#error = {
      result: false,
      message:''
    }
  }
  
  // Genera el id para los productos de marena incremental
  #generateID(){
    return (this.#products.length === 0) 
      ? 1 
      : this.#products[this.#products.length-1].id + 1
  }

  // Verifica si el el contenido de code no se encuetra repetido
  #validateCode(code){
    
    const resultSearch = this.#products.find( product => product.code === code )

    resultSearch 
      ? this.#error.message = `Ya existe el ${code} en el sistema `
      : this.#error.result = true

  }

  //Valida que los campos no esten vacios y si no lo estan invocan el metodo validateCode
  #validateKeys(title, description, price, thumbnail, code, stock){

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      this.#error.message = 'No se aceptan campos vacios';
    }else{
      this.#validateCode(code);
    }

  }

  // Agrega los campos que recibe al un arreglo en forma de objeto con un nuevo campo llamado id
  addProduct(title, description, price, thumbnail, code, stock ){
    
    this.#validateKeys(title, description, price, thumbnail, code, stock); 

    if(this.#error.result){

      this.#products.push({
          id: this.#generateID(), 
          title, 
          description, 
          price, 
          thumbnail, 
          code, 
          stock
      });

      console.log(`Se agrego efectivamente el producto : ${title}`);
     
    }else{
      console.log(`Error: ${this.#error.message}`);
    }

    this.#restarError();

  }

  // Retorna un array de productos
  getProductos(){
    return this.#products;
  } 

  // Busca el id que se pasa por parametro en el array de producto, si lo encuentra lo retorna caso contrario devuelve un mensjae
  getProductosByID(id){
    const resultadoBusqueda = this.#products.find(product => 
      product.id === id
    )
    return (resultadoBusqueda ?? `Not found`);
  }

}


const product = new ProductManager();


console.log('----- Listado de Productos ------');
console.log(product.getProductos());

console.log('----- Push de Productos ------');
product.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen',"abc123",25);
product.addProduct('producto prueba 2','Este es un producto prueba 2',20,'Sin imagen',"abc122",25);

product.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen',"abc123",25);

product.addProduct('producto prueba 3','Este es un producto prueba 3',2,'Sin imagen',"abc124",25);

console.log('----- Listado de Productos ------');
console.log(product.getProductos());

console.log('----- Filtro de Productos ------');
console.log(product.getProductosByID(12));

console.log(product.getProductosByID(1));