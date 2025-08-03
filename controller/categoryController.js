const Category = require('../models/Category');

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const category = await Category.create({ name, imageUrl });
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const updateData = { name: req.body.name };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, category: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
