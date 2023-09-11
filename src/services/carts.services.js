import CartRepository from '../repositories/cart.repository.js';
import { Cart } from '../dao/factory/carts.factory.js';

export const CartService = new CartRepository(new Cart());
