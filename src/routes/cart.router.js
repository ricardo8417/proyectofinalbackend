import { Router } from "express";

import CartModel from "../Dao/models/Cart.models.js";
import productsModel from "../Dao/models/Product.models.js";
import cartModel from "../Dao/models/Cart.models.js";
// import CartManager from "../manager/CartManager.js";
// import ProductManager from "../manager/ProductManager.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;

  try {
    const cart = await CartModel.findOne({ _id: cid });

    if (cart) {
      res.send(cart);
    } else {
      res.send("El carrito con el ID: " + cid + " no existe");
    }
  } catch (err) {
    res.status(404).send("Ha ocurrido un error: " + err.message);
  }
});

//se crea un carrito con un arreglo vacio del producto
router.post("/", async (req, res) => {
  try {
    let newcart= await  new CartModel({ products: [] }).save();

    res.send({ status: "success", payload: newcart });
  } catch (e) {
    res.status(500).send("ocurrio un error al crear el carrito");
  }
});


//Agrega un producto dentro del carrito.
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.body.quantity || 1);
  try {
    let cart = await CartModel.findById(cid);
    let productos = await productsModel.findById(pid);

    if (!cart) {
      cart = new CartModel({ products: { pid, quantity } });
      await cart.save();
    }
    if (productos) {
      const existProduct = cart.products.find((item) => item.pid.toString() === pid);

      if (existProduct) {
        existProduct.quantity += quantity;
        await cart.save();
      } else {
        cart.products.push({ pid, quantity });
        await cart.save();
      }
      res.send({ message: "producto guardado con exito" });
    } else {
      res.send({ message: "no existe el producto" });
    }
  } catch (e) {
    console.error("Error al guardar el producto:", e);
    res.status(500).send({ error: "Error al guardar el producto en el carrito" });
  }
});

//Eliminar Todos los productos dentro del carrito
router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;

  const cart = await CartModel.findById(cid);

  try {
    if (!cart) {
      res.send("El carrido con id: " + cid + " no existe");
    } else {
      await CartModel.updateOne({ _id: cid }, { $set: { products: [] } });
      res.send("Todos los productos fueron eliminados exitosamente");
    }
  } catch (error) {
    res.status(404).send("Ah ocurrido un erro inesperado");
  }
});

//Actualizar Cantidad del producto dentro del carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  let cart = await CartModel.findById(cid);

  try {
    const product = cart.products.find((item) => item.pid.toString() === pid);

    if (!product) {
      res.send("El producto que intenta actualizar no existe");
    } else {
      product.quantity += quantity;
      cart.save();
      res.send("Producto actualizado correctamente");
    }
  } catch (e) {
    res.status(404).send({ error: "Ha ocurrido un error", message: e.message });
  }
});


//Eliminar un producto dentro del carrito.
router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    const deletecart = await cartModel.findByIdAndUpdate(
      { _id: cid },
      {
        $pull: { products: { _id: pid } },
      },
      { new: true }
    );

    res.send(deletecart);
  } catch (e) {
    res.send(e);
  }
});
// const cartManager = new CartManager("./dataBase/dataCart.json");
// const producto = new ProductManager("./dataBase/productos.json")

router.get("/", async (req, res) => {
  try {
    const carts = await CartModel.find();
    res.send(carts);
    // res.status(200).json(carts);
  } catch (e) {
    res.send(e);
  }
});

// router.post("/", async (req, res) => {
//   try {
//     const addCart = await cartManager.createCart();
//     res.status(200).json(addCart);
//   } catch (e) {
//     res.status(404).json({ error404: "Not Found" });
//   }
// });

// router.delete("/:cid", async (req, res) => {
//   const { cid } = req.params;
//   try {
//     await cartManager.deleteCart(Number(cid));
//     res.status(200).json(`Cart with id: ${cid} was removed`);
//   } catch (err) {
//     res.status(400).json({ error400: "Bad Request" });
//   }
// });

// router.post("/:cid/products/:pid",async(req,res) =>{
//   try{
//     const cid = Number(req.params.cid)
//     const pid= Number(req.params.pid)
//     console.log(await producto.getProductById(pid))

//   const addProduct = await cartManager.updateCart(cid, pid, 1);

//   res.status(200).json(addProduct)

//   }catch(e){
//  res.status(400).json({ error400: "Bad Request" });
//   }

// });
export default router;
