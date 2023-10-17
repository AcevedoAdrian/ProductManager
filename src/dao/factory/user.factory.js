import config from '../../config/config.js';

let User;
switch (config.persistence) {
  case 'MONGO':
    const { default: UserDAO } = await import('../user.mongo.dao.js');
    User = UserDAO;
    break;
  default:
    break;
}
export { User };
