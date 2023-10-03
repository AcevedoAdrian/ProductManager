import express from 'express';
import { serverSocketio } from '../utils/serverSocketio.js';
import { authorization } from '../middleware/authorization.middleware.js';
const router = express.Router();

router.get('/', authorization(['USER']),
  (req, res) => {
    try {
      // console.log(req.user.email);
      // req.user;
      const io = req.app.get('socketio');
      serverSocketio(io);
      res.render('chat', { user: req.user.email });
    } catch (error) {
      res.status(400).json({ status: 'success', message: error.message });
    }
  });

export default router;
