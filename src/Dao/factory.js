import mongoose from "mongoose";

export let Product
let persistence = "Mongo" //Persistence será importado desde el punto .env

switch (persistence) {
  case "Mongo":
    const { default: ProductMongo } = await import("./mongo/products.mongo.js");
    Product = ProductMongo;
    break;
  case "File":
    const { default: ProductFile } = await import("./file/products.file.js");
    Product = ProductFile;
    break;

    default: break
}