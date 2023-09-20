import express from 'express';
import { serverSocketio } from '../utils/serverSocketio.js';
const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const io = req.app.get('socketio');
//     // const messages = await messageModel.find().lean().exec();
//     const messages = [{ user: 'adrian', message: 'hola' }];

//     io.emit('saludo', messages);
//     res.render('chat');
//   } catch (error) {
//     res.status(400).json({ status: 'success', message: error.message });
//   }
// });
router.get('/', (req, res) => {
  try {
    const io = req.app.get('socketio');
    serverSocketio(io);
    res.render('chat');
  } catch (error) {
    res.status(400).json({ status: 'success', message: error.message });
  }
});

// router.post('/', async (req, res) => {
//   console.log('Post chat/' + req.body);
//   try {
//     const message = await messageModel.create(req.body);
//     res.status(200).json({ status: 'successs', payload: message });
//   } catch (error) {
//     res.status(500).json({ status: 'success', message: error.message });
//   }
//   res.render('chat', {});
// });

export default router;
