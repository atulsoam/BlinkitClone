import mongoose from "mongoose";
import "dotenv/config.js";
import { categories, products } from "./seedData.js";
import { MainCategory } from "../models/index.js";

const senddatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://atulsoam37:SMct1qp4ZyjFwAyw@cluster0.sjdvopm.mongodb.net/Blinkit?retryWrites=true&w=majority&appName=Cluster0"
    );
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    // console.log("deleted");

    // const catogerydocs = await Category.insertMany(categories);

    // const catogeriesmap = catogerydocs.reduce((map, catogery) => {
    //   map[catogery.name] = catogery._id;
    //   return map;
    // }, {});

    // const productwithID = products.map((product) => ({
    //   ...product,
    //   category: catogeriesmap[product.category],
    // }));
    const data = [
      {
        name: "Baby Care",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444870/category/f6er254kgnmymlbguddd.png",
        subCategory: ["676d2cdd6c29f34ea2db0f07"],
      },
      {
        name: "Dairy Products",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444869/category/cq7m7yxuttemyb4tkidp.png",
        subCategory: ["676d2cdd6c29f34ea2db0f02"],
      },
      {
        name: "Groceries",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444869/category/uic8gcnbzknosdvva13o.png",
        subCategory: ["676d2cdd6c29f34ea2db0f04", "676d2cdd6c29f34ea2db0f08"],
      },
      {
        name: "Snacks & Munchies",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444869/category/vyakccm3axdyt8yei8wc.png",
        subCategory: ["676d2cdd6c29f34ea2db0f05"],
      },
      {
        name: "Home & Office",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444869/category/diucqrlsuqympqtwdkip.png",
        subCategory: ["676d2cdd6c29f34ea2db0f06"],
      },
      {
        name: "Health & Pharma",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444870/category/n438dcddfgrhyq9mck3z.png",
        subCategory: ["676d2cdd6c29f34ea2db0f03"],
      },
      {
        name: "Cleaning Essentials",
        image:
          "https://res.cloudinary.com/dponzgerb/image/upload/v1723444869/category/pfbuktnsxdub5njww7tj.png",
        subCategory: ["676d2cdd6c29f34ea2db0f09"],
      },
    ];

    await MainCategory.insertMany(data);
    console.log("Database seeded succesfully");
  } catch (error) {
    console.log(error);
  }
};
senddatabase();
