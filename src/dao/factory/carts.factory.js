import config from '../../config/config.js';

let Cart;

switch (config.persistence) {
  case 'MONGO':
    const { default: CartDAO } = await import('../carts.mongo.dao.js');
    Cart = CartDAO;
    break;
  default:
    break;
}

export { Cart };
