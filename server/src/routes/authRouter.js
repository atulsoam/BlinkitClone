import {
  fetchUser,
  loginCustomer,
  loginDeliverPartner,
  refresnTokenCustomerDeliveryPartner,
} from "../controllers/auth/authController.js";
import { verifyTokenmiddleWare } from "../middleware/AuthMiddalware.js";
import { updateUser } from "../controllers/tracking/userProfile.js";

// const middleware = async (req,res)=>{
//   const isAunthacated = verify
// }

export const authRoutes = (fastify, options, done) => {
  fastify.post("/customer/login", loginCustomer);
  fastify.post("/deliveryPartner/login", loginDeliverPartner);
  fastify.post(
    "/refreshToken",
    refresnTokenCustomerDeliveryPartner
  );
  fastify.get("/fetchuser", { preHandler: [verifyTokenmiddleWare] }, fetchUser);
  fastify.patch("/updateUser", { preHandler: [verifyTokenmiddleWare] }, updateUser);
  done();
};
