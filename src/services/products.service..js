// import ProductDAO from '../dao/product.mongo.dao.js';
import { Product } from '../dao/factory/products.factory.js';
import ProdcutRepository from '../repositories/product.repository.js';

export const ProductService = new ProdcutRepository(new Product());

export const getProductsService = async (req) => {
  // PREGUNTO SI LOS PARAMETROS SON NULL, UNDEFINED
  const productByLimit = +req.query.limit || 10;
  const productByPage = +req.query.page || 1;
  const productAvailability = +req.query.stock || '';
  const productBySort = req.query.sort ?? 'asc';
  const productByCategory = req.query.category || '';

  let productFilter = {};
  if (req.query.category) {
    productFilter = { category: productByCategory };
  }
  if (req.query.stock) {
    productFilter = { ...productFilter, stock: productAvailability };
  }
  // ORDENO POR DES SOLO SI ASI VIENE POR PARAMETRO CASO CONTRARIO ORDENO POR LO QUE SEA ASC
  let optionsPrice = {};
  if (productBySort === 'desc') {
    optionsPrice = { price: -1 };
  } else {
    optionsPrice = { price: 1 };
  }

  const optionsLimit = {
    limit: productByLimit,
    page: productByPage,
    sort: optionsPrice
  };
  const result = await ProductService.getAllPaginate(productFilter, optionsLimit);

  const payload = result.docs;
  const limit = result.limit;
  const totalPages = result.totalPages;
  const prevPage = result.prevPage;
  const nextPage = result.nextPage;
  const page = result.page;
  const hasPrevPage = result.hasPrevPage;
  const hasNextPage = result.hasNextPage;
  const prevLink = hasPrevPage
    ? `/api/product?page=${prevPage}&limit${productByLimit}`
    : '';
  const nextLink = hasNextPage
    ? `/api/product?page=${nextPage}&limit${productByLimit}`
    : '';
  return {
    payload,
    limit,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink
  };
};
