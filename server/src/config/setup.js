import AdminJS from "adminjs";
import * as AdminJsMongoose from "@adminjs/mongoose";
import * as models from "../models/index.js";
import AdminJSFastify from "@adminjs/fastify";
import { authenticate, COKKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light } from "@adminjs/themes";

AdminJS.registerAdapter(AdminJsMongoose);

export const Admin = new AdminJS({
  resources: [
    {
      resource: models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
      },
    },
    {
      resource: models.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
      },
    },
    {
      resource: models.Branch,
    },
    {
      resource: models.Product,
    },
    {
      resource: models.Category,
    },
    {
      resource: models.Order,
    },
    {
      resource: models.Counter,
    },
    {
      resource: models.MainCategory,
    },
  ],
  branding: {
    companyName: "BalaJiFoods",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light],
  rootPath: "/admin",
});

export const BuildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    Admin,
    {
      authenticate,
      cookiePassword: COKKIE_PASSWORD,
      cookieName: "adminjs",
    },
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COKKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
};
