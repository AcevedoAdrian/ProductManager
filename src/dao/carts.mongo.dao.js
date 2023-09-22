import cartModel from '../models/carts.model.js';
import ticketModel from '../models/tickets.model.js';

export default class CartDAO {
  getById = async (id) => await cartModel.findById(id).lean().exec();
  getByIdPopulate = async (id) => await cartModel.findById(id).populate('products.product').lean();// el lean es para que tome los objetos
  getPurchase = async (id) => await ticketModel.findById(id).lean().exec();
  create = async (cart) => await cartModel.create(cart);
  createPurchase = async (ticket) => await ticketModel.create(ticket);
  // TAMBIEN PUEDE IR EL findByIdAndUpdate(dilter, update, {returnDocument: 'after'})
  update = async (filter, update) => await cartModel.findOneAndUpdate(filter, update, { returnOriginal: false, new: true });
  delete = async (id) =>
    await cartModel
      .findByIdAndUpdate(id, { products: [] }, { new: true })
      .lean()
      .exec();
}
