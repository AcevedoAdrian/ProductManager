import { faker } from '@faker-js/faker';
import CustomError from './errors/custom_error.js';
import EErrors from './errors/enums.js';
import { generateProductErrorInfo } from './errors/info.js';

export const generateProductFaker = async () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 100000, max: 100000, symbol: '$' }),
    thumbnails: [faker.image.url()],
    code: faker.string.alphanumeric(8),
    category: faker.commerce.productName(),
    stock: faker.number.int(50),
    status: faker.datatype.boolean({ probability: 1.0 })
  };
};

export const createProductFacker = async (req) => {
  const product = req.body;
  console.log(req.body);
  if (!product.title || !product.code || !product.price) {
    const data = {
      name: 'Product creation error',
      cause: generateProductErrorInfo(product),
      message: 'Error typing to create a product',
      code: EErrors.INVALID_TYPES_ERROR
    };
    return CustomError.createError(data);
  }
  const newProduct = {
    _id: faker.database.mongodbObjectId(),
    title: product.title,
    description: product.description || faker.commerce.productDescription(),
    price: parseFloat(product.price),
    thumbnails: product.thumbnail || [],
    code: product.code || faker.string.alphanumeric(8),
    category: product.category || '',
    stock: parseInt(product.stock) || 0
  };
  return newProduct;
};
