import "dotenv/config";
import Fastify from "fastify";
import { ConnectToMongoDB } from "./src/config/ConnectToMongo.js";
import { port } from "./src/config/config.js";
import { BuildAdminRouter, Admin } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/indexRoute.js";
import fastifySocketIO from "fastify-socket.io";
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
  app.listen({ port: port }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Server is running at ${port}, ${Admin.options.rootPath}`);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log(`A user Connected ${socket.id}`);
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("User Joined Room", orderId);
      });
      socket.on("disconnect", () => {
        // socket.join(orderId);
        console.log("User disconnected");
      });
    });
  });
};
start();
