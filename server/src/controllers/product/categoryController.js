import { Category, MainCategory } from "../../models/index.js";

export const getAllCatagories = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).send(category);
  } catch (error) {
    console.log(`Error in getAllCatagories ${error}`);
    return res.status(405).send({ message: "Couldn't fetch Category" });
  }
};

export const getAllmainCatagories = async (req, res) => {
  try {
    const Maincategory = await MainCategory.find().populate("subCategory");
    return res.status(200).send(Maincategory);
  } catch (error) {
    console.log(`Error in getAllCatagories ${error}`);
    return res.status(405).send({ message: "Couldn't fetch Maincategory" });
  }
};

export const getCatagoriesbySubCatagory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(405).send({ message: "category can't be null" });
    }
    const catogeryId = await Category.findById(category);
    if (!catogeryId) {
      return res.status(405).send({ message: "category not found" });
    }
    const Maincategory = await MainCategory.findById(
      catogeryId.mainCategory
    ).populate("subCategory");

    return res.status(200).send(Maincategory.subCategory);
  } catch (error) {
    console.log(`Error in getCatagoriesbySubCatagory ${error}`);
    return res
      .status(405)
      .send({ message: "Couldn't fetch getCatagoriesbySubCatagory" });
  }
};
