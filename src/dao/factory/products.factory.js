import config from '../../config/config.js';

let Product;
switch (config.persistence) {
  case 'MONGO':
    const { default: ProductDAO } = await import('../product.mongo.dao.js');
    Product = ProductDAO;
    break;
  default:
    break;
}
export { Product };
