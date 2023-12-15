import productModel from "../models/Product.models.js";

 class ProductsMongo {
   constructor() {}
   getProduct = async () => {
     return await productModel.find();
   };
   getProductById = async (pid) => {
     return await productModel.findById(pid).lean().exec();
   };

   addProduct = async(newProduct)=>{
    return await productModel.create(newProduct);
   }
 }


export default ProductsMongo