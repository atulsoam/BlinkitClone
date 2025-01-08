import { getAllCatagories } from "../controllers/product/categoryController.js";
import { getProductByCategory } from "../controllers/product/productController.js";

export const productRoutes = (fastify, options, done) => {
  fastify.get("/getProductByCategory/:category", getProductByCategory);

  done();
};

export const categoryRoutes = (fastify, options, done) => {
  fastify.get("/getAllCatagories", getAllCatagories);

  done();
  
};
