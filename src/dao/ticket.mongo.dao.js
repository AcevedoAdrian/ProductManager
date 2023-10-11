
import ticketModel from '../models/tickets.model.js';

export default class TicketDAO {
  getByIdPopulate = async (id) => await ticketModel.findById(id).populate('products.product').lean();// el lean es para que tome los objetos
}
