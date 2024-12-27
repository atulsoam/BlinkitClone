import { authRoutes } from "./authRouter.js";
import { orderRoutes } from "./orderRoutes.js";
import { categoryRoutes, productRoutes } from "./productRoutes.js";

const prefix = "/api";

export const registerRoutes = async (fastify) => {
  fastify.register(authRoutes, { prefix: prefix });
  fastify.register(productRoutes, { prefix: prefix });
  fastify.register(categoryRoutes, { prefix: prefix });
  fastify.register(orderRoutes, { prefix: prefix });

  //   done()
};
