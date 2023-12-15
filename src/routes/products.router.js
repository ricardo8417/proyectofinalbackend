import {Router} from 'express'
import productModel from '../Dao/models/Product.models.js'
import { getProducts,getProductById,addProduct } from '../controllers/product.controllers.js';
const router = Router()

router.get("/prueba",getProducts)
router.get("/prueba/:_id",getProductById);
router.post("/prueba",addProduct)
router.post("/", async (req, res) => {
  try {
   

    //1 creo un objeto:

    const newProduct = {
      title,
      descripcion,
      price,
      thumbnail,
      code,
      stock,
      category
    };

    //2 uso el modelo para subir el objeto a la base de datos:

    const result = await productModel.create(newProduct);

    res.send({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    res.send({ result: "error", error });
  }
});

//Borrar Productos
router.get('/delete/:pid',async(req,res)=>{
  try{
    const id = req.params.pid;
       await productModel.deleteOne({_id:id})
      res.redirect("/products");

  }catch(error){
    res.send({ result: "error", error });
  }
})


router.get('/',async(req,res)=>{
    try{
    const products= await productModel.find()

 res.send(products)
  }catch(e){
    res.send(e)
  }
 
})

router.get("/:_id", async (req, res) => {
  const pid = req.params._id
  if (pid > 0) {
    try {
      const product = await productModel.findById(pid).lean().exec();
      if (!product) return res.send("el porducto de id " + pid + " no existe");
      return res.send(product);
    } catch (error) {
      res.status(500).send("Error al obtener los productos");
    }
  } else {
    res.send("el id del producto no puede ser menos que o igual que 0");
  }
});



export default router