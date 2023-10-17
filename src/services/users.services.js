// import ProductDAO from '../dao/product.mongo.dao.js';
import { User } from '../dao/factory/user.factory.js';
import UserRepository from '../repositories/user.repository.js';

export const UserService = new UserRepository(new User());
