export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getByIdPopulate = async (id) => await this.dao.getByIdPopulate(id);
}
