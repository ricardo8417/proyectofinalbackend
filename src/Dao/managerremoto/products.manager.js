import productModels from '../models/Product.models.js'

export default class ProductManager {
  _getNextOrder = async () => {
    const count = await productModels.count();
    const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

    return nextId;
  };

  addProduct = async (product) => {
    try {
      const validate = await productModels.findOne({ code: product.code });
      if (validate) {
        console.log(`The product with code: ${product.code} already exists`);
        throw new Error(
          `The product with code: ${product.code} already exists`
        );
      } else {
        product.status = true;

        await ProductModel.create(product);
        return "Product created successfully";
      }
    } catch (err) {
      throw err;
    }
  };

deleteProduct= async(id)=>{
  try{
const productDelete= await productModels.deleteOne(id)
if (productDelete === null) {
  console.log("Product does not exist");
  throw new Error("Product does not exist");
}

return "Product removed successfully";

  }catch(error){

  }
}

}