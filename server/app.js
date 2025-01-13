import "dotenv/config";
import Fastify from "fastify";
import { ConnectToMongoDB } from "./src/config/ConnectToMongo.js";
import { port } from "./src/config/config.js";
import { BuildAdminRouter, Admin } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/indexRoute.js";
import fastifySocketIO from "fastify-socket.io";
import { SendLiveUpdatedToClient, UpdtaeDeliveryPersonLocation } from "./src/controllers/socketFunctions/updateLocations.js";
const start = async () => {
  await ConnectToMongoDB(process.env.MONGO_URI);

  const app = await Fastify();
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });
  await registerRoutes(app);
  await BuildAdminRouter(app);
  app.listen({ port: port, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Server is running at ${addr}, ${Admin.options.rootPath}`);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log(`A user Connected ${socket.id}`);
      socket.on("joinRoom", async (orderId) => {
        socket.join(orderId);
        console.log("User Joined Room", orderId);
        // const orderData =  await SendLiveUpdatedToClient(orderId)
        // app.io.to(orderId).emit("orderUpdates", orderData);

      });
      socket.on("updateLocation", async (data) => {
        console.log(data, 39);
        if (data.orderId && data.userID && data.location) {
          const orderData = await UpdtaeDeliveryPersonLocation(
            data.orderId,
            data.userID,
            data.location,
            app.io
          );
        }
        // if (orderData){
        //   so(data.orderId).emit("orderUpdates", orderData);

        // }
      });

      socket.on("needOrderData",async(orderid)=>{
        console.log(orderid,"from needOrderData");
        
        const orderData =  await SendLiveUpdatedToClient(orderid,app.io)
        // app.io.to(orderid).emit("orderUpdates", orderData);
      })

      socket.on("disconnect", () => {
        // socket.join(orderId);
        console.log("User disconnected");
      });
    });
  });
};
start();
