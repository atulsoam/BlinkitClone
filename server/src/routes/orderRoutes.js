import {
  confirmOrder,
  CreateOrder,
  getOrder,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order/OrderController.js";
import { verifyToken } from "../middleware/AuthMiddalware.js";

export const orderRoutes = (fastify, options, done) => {
  fastify.addHook("preHandler", async (req, res) => {
    const isAunthacitated = verifyToken(req, res);
    if (!isAunthacitated) {
      return res.status(500).send({ message: "Not authorized" });
    }
  });
  fastify.post("/order", CreateOrder);
  fastify.post("/getAllOrder", getOrder);
  fastify.patch("/updateOrder/:orderId", updateOrderStatus);
  fastify.post("/confirm/:orderId", confirmOrder);
  fastify.get("/getOrderById/:orderId", getOrderById);

  done();
};
