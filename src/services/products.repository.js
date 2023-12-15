export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProduct = async () => {
    return await this.dao.getProduct();
  };
  getProductById = async (pid) => {
    return await this.dao.getProductById(pid);
  };

  addProduct = async (newProduct) => {
    return await this.dao.addProduct(newProduct);
  };
}

