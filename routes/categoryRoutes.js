const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/create', upload.single('image'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/update/:id', upload.single('image'), categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
