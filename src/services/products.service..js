// import ProductDAO from '../dao/product.mongo.dao.js';
import { Product } from '../dao/factory/products.factory.js';
import ProdcutRepository from '../repositories/product.repository.js';

export const ProductService = new ProdcutRepository(new Product());
