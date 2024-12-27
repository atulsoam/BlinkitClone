import mongoose from "mongoose";
import "dotenv/config.js";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./seedData.js";

const senddatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("deleted");
    
    const catogerydocs = await Category.insertMany(categories);

    const catogeriesmap = catogerydocs.reduce((map, catogery) => {
      map[catogery.name] = catogery._id;
      return map;
    }, {});

    const productwithID = products.map((product) => ({
      ...product,
      category: catogeriesmap[product.category],
    }));

    await Product.insertMany(productwithID);
    console.log("Database seeded succesfully");
  } catch (error) {
    console.log(error);
  }
};
senddatabase();
