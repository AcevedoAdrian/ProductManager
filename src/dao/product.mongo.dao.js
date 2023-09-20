import productModel from '../models/products.model.js';

export default class ProductDAO {
  getAll = async () => await productModel.find();
  // getAllPaginate = async (filter, options) => await productModel.paginate(filter, options);
  getAllPaginate = async (req) => {
    try {
      // PREGUNTO SI LOS PARAMETROS SON NULL, UNDEFINED
      const productByLimit = +req?.query.limit || 10;
      const productByPage = +req?.query.page || 1;
      const productAvailability = +req?.query.stock || '';
      const productBySort = req?.query.sort ?? 'asc';
      const productByCategory = req?.query.category || '';

      let productFilter = {};
      if (productByCategory) {
        productFilter = { category: productByCategory };
      }
      if (productAvailability) {
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
      const productAll = await productModel.paginate(productFilter, optionsLimit);

      const payload = productAll.docs;
      const totalPages = productAll.totalPages;
      const prevPage = productAll.prevPage;
      const nextPage = productAll.nextPage;
      const page = productAll.page;
      const hasPrevPage = productAll.hasPrevPage;
      const hasNextPage = productAll.hasNextPage;
      const prevLink = hasPrevPage
        ? `/api/product?page=${prevPage}&limit${productByLimit}`
        : '';
      const nextLink = hasNextPage
        ? `/api/product?page=${nextPage}&limit${productByLimit}`
        : '';
      return ({
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      });
    } catch (error) {
      return error;
    }
  };

  getById = async (id) => await productModel.findById(id).lean().exec();
  create = async (data) => await productModel.create(data);
  // actualiza el producto y devuelve con los datos anterios si no ponemos el returnDocument
  update = async (id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  delete = async (id) => await productModel.findByIdAndDelete(id);
}
