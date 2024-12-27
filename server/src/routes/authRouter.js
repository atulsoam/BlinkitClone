import {
  fetchUser,
  loginCustomer,
  loginDeliverPartner,
  refresnTokenCustomerDeliveryPartner,
} from "../controllers/auth/authController.js";
import { verifyToken } from "../middleware/AuthMiddalware.js";
import { updateUser } from "../controllers/tracking/userProfile.js";

export const authRoutes = (fastify, options, done) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/deliveryPartner/login", loginDeliverPartner);
  fastify.post(
    "/refreshToken",
    refresnTokenCustomerDeliveryPartner
  );
  fastify.get("/fetchuser", { preHandler: [verifyToken] }, fetchUser);
  fastify.patch("/updateUser", { preHandler: [verifyToken] }, updateUser);
  done();
};
