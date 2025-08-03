const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

let categoryId;
let productId;

beforeAll(async () => {
  // Optionally connect to test DB
});

afterAll(async () => {
  await Category.deleteMany({});
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe('Category API', () => {
  it('should create a category', async () => {
    const res = await request(app)
      .post('/api/categories/create')
      .field('name', 'Electronics');
    expect(res.statusCode).toBe(201);
    expect(res.body.category.name).toBe('Electronics');
    categoryId = res.body.category._id;
  });

  it('should get all categories', async () => {
    const res = await request(app).get('/api/categories/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('should get category by id', async () => {
    const res = await request(app).get(`/api/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.category._id).toBe(categoryId);
  });

  it('should update a category', async () => {
    const res = await request(app)
      .put(`/api/categories/update/${categoryId}`)
      .field('name', 'Updated Electronics');
    expect(res.statusCode).toBe(200);
    expect(res.body.category.name).toBe('Updated Electronics');
  });

  it('should delete a category', async () => {
    const res = await request(app).delete(`/api/categories/delete/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Category deleted');
  });
});

describe('Product API', () => {
  beforeAll(async () => {
    // Create a category for product tests
    const cat = await Category.create({ name: 'Books' });
    categoryId = cat._id;
  });

  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products/add-product')
      .field('name', 'Node.js Guide')
      .field('price', 100)
      .field('category', categoryId)
      .field('description', 'A book about Node.js')
      .field('inStock', true);
    expect(res.statusCode).toBe(201);
    expect(res.body.product.name).toBe('Node.js Guide');
    productId = res.body.product._id;
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products/');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('should get product by id', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.product._id).toBe(productId);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/update/${productId}`)
      .field('name', 'Updated Node.js Guide')
      .field('price', 120);
    expect(res.statusCode).toBe(200);
    expect(res.body.product.name).toBe('Updated Node.js Guide');
  });

  it('should update product stock', async () => {
    const res = await request(app)
      .patch(`/api/products/stock/${productId}`)
      .send({ inStock: false });
    expect(res.statusCode).toBe(200);
    expect(res.body.product.inStock).toBe(false);
  });

  it('should delete a product', async () => {
    const res = await request(app).delete(`/api/products/delete/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted');
  });
});
