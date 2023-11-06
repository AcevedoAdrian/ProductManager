import express from 'express';
import UserDTO from '../dto/user.dto.js';
import { sendMailDeleteUser } from '../utils/nodemailer.js';
import { UserService } from '../services/users.services.js';
import { CartService } from '../services/carts.services.js'; import { authorization } from '../middleware/authorization.middleware.js';
const router = express.Router();

router.get('/', authorization(['ADMIN', 'PREMIUM']),
  async (req, res) => {
    try {
      const result = await UserService.getAll();
      const users = result.map(user => new UserDTO(user));
      if (req.headers['content-type'] === 'application/json') {
        res.json({ status: 'succes', peyload: users });
      } else {
        res.render('users/users', { users });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: `Error al RETORNAR LISTA de usuarios: ${error.reason} ${error.message}`
      });
    }
  }
);

router.delete('/:uid', authorization(['ADMIN']), async (req, res) => {
  try {
    const idUsuario = req.params.uid;
    console.log(idUsuario);
    const userByID = await UserService.findById(idUsuario);
    if (!userByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro el usuario con el id ${idUsuario}`
      });
    }

    if (userByID.role === 'admin') {
      return res.status(400).json({
        status: 'error',
        message: 'Error: No se puedo ELIMINAR un usuario admin'
      });
    }

    const cartDelete = await CartService.delete(userByID.cart);
    if (!cartDelete) {
      return res.status(400).json({
        status: 'error',
        message: `Error: No se puedo ELIMINAR el usuario con el id ${idUsuario}`
      });
    }
    const userDelete = await UserService.delete(idUsuario);
    if (!userDelete) {
      return res.status(400).json({
        status: 'error',
        message: `Error: No se puedo ELIMINAR el usuario con el id ${idUsuario}`
      });
    }
    res.status(200).json({
      status: 'succses',
      message: `Se ELIMINO correctamente el producto ${idUsuario}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 'error',
      message: `Error al ELIMINAR usuaio ${error.reason} ${error.message}`
    });
  }
});
router.delete('/', authorization(['ADMIN']),
  async (req, res) => {
    try {
      const currentDate = new Date();
      const twoDaysAgo = new Date(currentDate);
      twoDaysAgo.setDate(currentDate.getDate() - 2);
      /* const thirtyMinutesAgo = new Date(currentDate);
      thirtyMinutesAgo.setMinutes(currentDate.getMinutes() - 30); */
      const ususariosInactivos = await UserService.findInactiveUsers(twoDaysAgo);

      const inactiveUsers = ususariosInactivos.filter((user) => user.role !== 'admin');
      // Eliminar usuarios inactivos
      if (inactiveUsers.length > 0) {
        for (const user of inactiveUsers) {
          const cartDelete = await CartService.delete(user.cart);
          if (!cartDelete) {
            return res.status(400).json({
              status: 'error',
              message: 'Error: No se puedo ELIMINAR el usuario con el '
            });
          }
          await UserService.delete(user.id);
          await sendMailDeleteUser(user.email);
        }
        res.json({ status: 'success', message: 'Se eliminaron correctamente los usuario inactivos' });
      } else {
        res.json({ status: 'success', message: 'NO hay usuarios inactivos' });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: `Error al ELIMINAR usuario inactivos: ${error.reason} ${error.message}`
      });
    }
  }
);

router.put('/:uid', authorization(['ADMIN']), async (req, res) => {
  try {
    const idUsuario = req.params.uid;

    const userByID = await UserService.findById(idUsuario);

    if (!userByID) {
      return res.status(404).json({
        status: 'error',
        message: `Not Found: No se encontro el usuario con el id ${idUsuario}`
      });
    }
    if (userByID.role === 'admin') {
      return res.status(400).json({
        status: 'error',
        message: 'Error: No se puedo CAMBIAR el rol de un usuario admin'
      });
    }

    if (userByID.role === 'premium') {
      userByID.role = 'user';
    } else {
      userByID.role = 'premium';
    }

    const updatedUser = await UserService.update(idUsuario, userByID);

    res.status(200).json({
      status: 'succses',
      message: `Se ELIMINO correctamente el producto ${idUsuario}`
    });
  } catch (error) {
    return res.status(500).send({
      status: 'error',
      message: `Error al ACTUALIZAR un usuaio ${error.reason} ${error.message}`
    });
  }
});

export default router;
