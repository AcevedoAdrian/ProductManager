import multer from 'multer';
import { extname } from 'node:path';
import __dirname from '../utils.js';

// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, __dirname + '/public/img');
    cb(null, __dirname + '/public/img');
  },
  filename: function (req, file, cb) {
    const fileExtension = extname(file.originalname);
    const fileName = file.originalname.split(fileExtension)[0];

    cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    // cb(null, file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    console.log('files');
    const files = req.files;
    const errors = [];
    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      return res.status(400).json({ status: 'error', message: errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default uploadMiddleware;
