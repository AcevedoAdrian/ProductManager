export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => await this.dao.getAll();
  findOne = async (user) => await this.dao.findOne(user);
  findById = async (id) => await this.dao.findById(id);
  create = async (user) => await this.dao.create(user);
  update = async (id, data) => await this.dao.update(id, data);

  delete = async (id, data) => await this.dao.delete(id, data);
  findInactiveUsers = async (data) => await this.dao.findInactiveUsers(data);
}
