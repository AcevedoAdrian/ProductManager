import ProductDAO from '../dao/product.mongo.dao.js';

import ProdcutRepository from '../repositories/product.repository.js';

export const ProductService = new ProdcutRepository(new ProductDAO());
