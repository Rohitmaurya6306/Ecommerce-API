const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.post('/add-product', upload.single('image'), productController.addProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/update/:id', upload.single('image'), productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.patch('/stock/:id', productController.updateStock);

module.exports = router;
