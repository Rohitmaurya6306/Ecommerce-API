const Product = require('../models/product');
const Category = require('../models/Category');

exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description, inStock } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Check if category exists by ObjectId
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: `Category "${category}" does not exist`
      });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      imageUrl,
      description,
      inStock: inStock === 'true' || inStock === true
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, inStock } = req.body;
    const updateData = { name, price, description };
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(400).json({ success: false, message: "Category does not exist" });
      updateData.category = category;
    }
    if (typeof inStock !== 'undefined') updateData.inStock = inStock === 'true' || inStock === true;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { inStock } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock: inStock === 'true' || inStock === true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};