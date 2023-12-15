import ProductsRepository from "./products.repository.js";
import { Product } from "../Dao/factory.js";

export const productService = new ProductsRepository(new Product())