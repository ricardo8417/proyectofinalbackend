import { productService } from "../services/index.js"

export const getProducts = async (req,res)=>{
    console.log("aqui Estoy")
    const products = await productService.getProduct()
    res.send(products)
}

export const getProductById=async(req,res)=>{
      const pid = req.params._id;
const products =await productService.getProductById(pid)
res.send(products)


}

export const addProduct = async (req, res) => {

  const title= req.body.title
  const descripcion= req.body.descripcion
  const price= req.body.price
  const thumbnail=req.body.thumbnail
  const code= req.body.code
  const stock= req.body.stock
  const category=req.body.category

  const newProduct = {
    title,
    descripcion,
    price,
    thumbnail,
    code,
    stock,
    category,
  };

  console.log("Productos Agregados:", newProduct)
  const products = await productService.addProduct(newProduct);
  res.send({ status: "success", payload: products });
};

