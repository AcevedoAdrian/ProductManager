export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getById = async (id) => await this.dao.getById(id);
  getByIdPopulate = async (id) => await this.dao.getByIdPopulate(id);
  create = async (cart) => await this.dao.create(cart);
  update = async (filter, update) => await this.dao.update(filter, update);
  delete = async (id) => await this.dao.delete(id);
  createPurchase = async (ticket) => await this.dao.createPurchase(ticket);
  getPurchase = async (id) => await this.dao.getPurchase(id);
}
