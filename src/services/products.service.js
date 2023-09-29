// import ProductDAO from '../dao/product.mongo.dao.js';
import { Product } from '../dao/factory/products.factory.js';
import ProductRepository from '../repositories/product.repository.js';

export const ProductService = new ProductRepository(new Product());
