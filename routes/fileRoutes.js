const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/fileController');

const router = express.Router();

// Configure multer storage (optional, you can set this if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory where the files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // specify the file name format
  }
});

// Initialize multer with storage configuration (or use default storage)
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
