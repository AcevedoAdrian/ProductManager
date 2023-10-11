import config from '../../config/config.js';

let Ticket;
switch (config.persistence) {
  case 'MONGO':
    const { default: TicketDAO } = await import('../ticket.mongo.dao.js');
    Ticket = TicketDAO;
    break;
  default:
    break;
}
export { Ticket };
