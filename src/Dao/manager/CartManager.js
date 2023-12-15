import fs from 'fs'

export default class CartManager {
  constructor(path = "./dataBase/dataCart.json") {
    this.path = path; //nombre del archivo
    this.format = "utf-8"; //formato para leer el archivo
    this.carts = [];
  }

  getNextId = () => {
    const count = this.carts.length;
    const nextId = count > 0 ? this.carts[count - 1].id + 1 : 1;

    return nextId;
  };

  getCartById = async (id) => {
    try {
      let data = await this.getCarts();
      let result = data.find((element) => element.id == id);
      if (result) {
        return result;
      } else {
        return "Not found";
      }
    } catch (e) {
      console.log(e);
    }
  };

  getCarts = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      this.carts = carts;
      return carts;
    } catch {
      console.log("File not found");
      return [];
    }
  };

  createCart = async () => {
    const carts = await this.getCarts();

    try {
      const cart = {
        id: this.getNextId(),
        products: [],
      };

      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return carts;
    } catch (e) {
      return console.log(e);
    }
  };

  updateCart = async (idCart, idProduct, quantity = 1) => {
    const carts = await this.getCarts();
    try {
      const cart = await carts.find((cart) => cart.id === idCart);
      if (cart === undefined) {
        return console.log(`Cart with id: ${idCart} does not exist`);
      }

      if (!cart.products) {
        cart.products = [];
        return console.log(`The cart does not have products`);
      }

      const productExist = cart.products.find(
        (product) => product.id === idProduct
      );
      if (productExist) {
        productExist.quantity += quantity;
      } else {
        cart.products.push({
          id: idProduct,
          quantity,
        });
      }

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, "\t")
      );
      return cart;
    } catch (err) {
      return console.error(err);
    }
  };

  deleteCart = async (idCart) => {
    let carts = await this.getCarts();
    try {
      const cart = Object.values(carts).find((cart) => cart.id === idCart);
      if (cart) {
        carts = carts.filter((item) => item.id !== idCart);
        await fs.promises.writeFile(path, JSON.stringify(carts), "utf-8");

        return console.log("Cart removed");
      } else {
        return console.error("Cart does not exist");
      }
    } catch (err) {
      return console.error(err);
    }
  };



}

