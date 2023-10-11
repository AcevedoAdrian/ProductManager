// import ProductDAO from '../dao/product.mongo.dao.js';
import { Ticket } from '../dao/factory/ticket.factory.js';
import TicketRepository from '../repositories/ticket.repository.js';

export const TicketService = new TicketRepository(new Ticket());
