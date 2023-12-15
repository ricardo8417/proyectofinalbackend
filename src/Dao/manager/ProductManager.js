import fs from "fs"
// const fs = require("fs"); //Importamos fileSystem

 export default class ProductManager {
  constructor(path) {
    this.path = path; //nombre del archivo
    this.format = "utf-8"; //formato para leer el archivo
  }

  getNextId = async () => {
    const data = await this.getProduct(); //Traemos la lista en donde se encuentran los productos

    const count = data.length; //leeemos cuantos elementos tiene

    if (count > 0) return data[count - 1].id + 1; //Si tiene elementos leemos el ultimo id y retornamos el siguiente

    return 1; //Si no tiene elementos el ID es 1
  };
  //Agrega un producto
  addProduct = async (title, descripcion,price, thumbnail, code, stock) => {
    try {
      //Valida que no se agrege un objeto con campos vacios
      function validarProducto(product) {
        for (let campo in product) {
          if (!product[campo]) {
            return false;
          }
        }
        return true;
      }

      const list = await this.getProduct();

      const product = {
        id: await this.getNextId(),
        title,
        descripcion,
       price,
        thumbnail,
        code,
        stock,
      };

      const codeRep = list.some((element) => element.code === code);
      if (codeRep) {
        return console.log("No se pueden crear productos con code repetido");
      }

      if (validarProducto(product)) {
        list.push(product);
        await fs.promises.writeFile(this.path,JSON.stringify(list, null, "\t"),this.format);
      
      } else {
        return console.log("No pueden crearse productos con campos incompletos");
      }
    } catch (e) {
      console.log(e);
    }
  };
  //retorna los productos
  getProduct = async () => {
    try {
      const data = await fs.promises.readFile(this.path, this.format);
      const dataObj = JSON.parse(data);
      return dataObj;
    } catch (e) {
      return [];
    }
  };
  //Retorna un producto concreto
  getProductById = async (id) => {
    try {
      let data = await this.getProduct();
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
  //Elimina un producto
  deleteProduct = async (id) => {
    try {
      let data = await this.getProduct();

      let test = data.find((element) => element.id == id);

      if (test) {
        data = data.filter((element) => element.id != test.id);
        await fs.promises.writeFile(this.path,JSON.stringify(data, null, "\t"),this.format);
      } else {
        console.log("No existe el elemento, no se puede borrar");
      }
    } catch (e) {
      console.log(e);
    }
  };

  updateProduct = async (
    id,
    title,
    descripcion,
    price,
    thumbnail,
    code,
    stock
  ) => {
    try {
      let data = await this.getProduct();

      let test = data.find((element) => element.id == id);

      if (!test)
        return console.log("No se puede actualizar un objeto que no existe");

      if (!title || !descripcion || !price || !code || !stock) {
        return console.log("Error: Missing Variables");
      } else {
        test.title = title;
        test.descripcion = descripcion;
        test.price = price;
        test.thumbnail = thumbnail;
        test.code = code;
        test.stock = stock;
        await fs.promises.writeFile(this.path,JSON.stringify(data, null, "\t"),this.format);
      }
    } catch (e) {
      console.log(e);
    }
  };
}

// async function run() {
//   const manager = new ProductManager("productos.json");
//   console.log("----------Arreglo Vacio----------");
//   console.log(await manager.getProduct()); //Arreglo vacio
//   console.log();
//   //Creamos productos y los agregamos al archivo
//   await manager.addProduct(
//     "Notebook",
//     "Notebook Asus",
//     34000,
//     "ninguna",
//     50,
//     20
//   );
//   await manager.addProduct(
//     "Memoria Ram",
//     "Memoria kingstoon DDR4 16GB 3000MHz",
//     4000,
//     "nada",
//     51,
//     10
//   );
//   await manager.addProduct(
//     "tv",
//     "tv 4k Sony",
//     14000,
//     "Sin imagen",
//     53,
//     25
//   );
//   await manager.addProduct(
//     "Gabinete",
//     "Gabinete Kolink Inspire K3 RGB  M-ATX Vidrio Templado",
//     25700,
//     "nada",
//     54,
//     10
//   );
//   await manager.addProduct(
//     "Gabinete",
//     "Gabinete Kolink Inspire K3 RGB  M-ATX Vidrio Templado",
//     25700,
//     "nada",
//     55,
//     10
//   ); //repetido
//   await manager.addProduct(
//     "Gabinete",
//     "Gabinete para gamers",
//     25700,
//     "sin imagen",
//     56,
//     1
//   ); //Incompleto
//   console.log("-----Productos agregados-----");
//   console.log(await manager.getProduct());
//   console.log();
//   //Buscamos un objeto
//   console.log("Objeto con el ID 4");
//   console.log(await manager.getProductById(4)); //Elemento existente
//   console.log();
//   console.log("Objeto inexistente");
//   console.log(await manager.getProductById(143200)); //Elemento inexistente
//   console.log();
//   console.log("Eliminamos el objeto con ID 3 y mostramos el arreglo");
//   await manager.deleteProduct(3);
//   await manager.deleteProduct(5); //Eliminamos uno que no exista
//   console.log(await manager.getProduct());
//   console.log();
//   console.log("Modificamos los productos y mostramos el arreglo");
//   await manager.updateProduct(
//     1,
//     "Memoria Ram",
//     "Memoria GeiL DDR4 16GB 3000MHz Super Luce RGB Black",
//     39550,
//     "sin imagen",
//     9542,
//     1
//   );
//   await manager.updateProduct(
//     2,
//     "Notebook",
//     "Notebook Gamer Acer Nitro 5 15.6",
//     "465.999",
//     "sin imagen",
//     14320,
//     1
//   );
//   await manager.updateProduct(
//     2,
//     "",
//     "Notebook Gamer Acer Nitro 5 15.6",
//     35000,
//     "sin imagen",
//     14320,
//     1
//   );
//   await manager.updateProduct(3, "", "", "", "", "", 0);
//   console.log(await manager.getProduct());
//   console.log();
// }

// run();
