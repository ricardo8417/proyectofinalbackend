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
   addProduct = async (title, descripcion, price, thumbnail, code, stock) => {
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
         await fs.promises.writeFile(
           this.path,
           JSON.stringify(list, null, "\t"),
           this.format
         );
       } else {
         return console.log(
           "No pueden crearse productos con campos incompletos"
         );
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
   getProductById = async (pid) => {
     try {
       let data = await this.getProduct();
       let result = data.find((element) => element.id == pid);
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
         await fs.promises.writeFile(
           this.path,
           JSON.stringify(data, null, "\t"),
           this.format
         );
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
         await fs.promises.writeFile(
           this.path,
           JSON.stringify(data, null, "\t"),
           this.format
         );
       }
     } catch (e) {
       console.log(e);
     }
   };
 }