import {
  getAllCatagories,
  getAllmainCatagories,
  getCatagoriesbySubCatagory,
} from "../controllers/product/categoryController.js";
import {
  getAllProduct,
  getProductByCategory,
} from "../controllers/product/productController.js";

export const productRoutes = (fastify, options, done) => {
  fastify.get("/getProductByCategory/:category", getProductByCategory);
  fastify.get("/getAllProduct", getAllProduct);

  done();
};

export const categoryRoutes = (fastify, options, done) => {
  fastify.get("/getAllCatagories", getAllCatagories);
  fastify.get("/getAllMainCatagories", getAllmainCatagories);

  fastify.get(
    "/getcatagoryByuSubCategory/:category",
    getCatagoriesbySubCatagory
  );

  done();
};
