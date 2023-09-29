import { generateProductFaker, createProductFacker } from '../services/faker.js';
import { ProductService } from '../services/products.service.js';
const products = [];
export const getProductMockController = async (req, res, next) => {
  try {
    for (let i = 0; i < 100; i++) {
      products.push(await generateProductFaker());
    }
    await ProductService.create(products);
    res.status(200).json({ status: 'success', payload: products });
  } catch (error) {
    return res.status(400).json({ status: 'error', error: error.message });
  }
};

export const createProductMockController = async (req, res, next) => {
  try {
    console.log(req.body);
    const product = await createProductFacker(req);
    products.push(product);
    res.status(201).json({ status: 'success', payload: products });
  } catch (error) {
    next(error);
  }
};
