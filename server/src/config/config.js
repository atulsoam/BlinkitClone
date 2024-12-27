import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";

import { Admin } from "../models/index.js";

const MongoDbStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: "session",
});

sessionStore.on("error", (error) => {
  console.log(`Error in config.js ${error}`);
});

export const authenticate = async (email, password) => {
  const AdminUser = await Admin.findOne({ email });
  if (!AdminUser) {
    return null;
  }
  if (password === AdminUser.password) {
    return Promise.resolve({ email, password });
  } else {
    return null;
  }
};

export const port = process.env.PORT || 3000;
export const COKKIE_PASSWORD = process.env.COKKIE_PASSWORD;
