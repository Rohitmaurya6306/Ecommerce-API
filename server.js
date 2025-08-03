const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
// const productController = require('./controller/productController');

const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


// DB Connection
// mongoose.connect('mongodb://localhost:27017/ecommerce', {
mongoose.connect('mongodb+srv://marohit789:marohit789@cluster0.2yyola7.mongodb.net/myEcommerce', {

  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));