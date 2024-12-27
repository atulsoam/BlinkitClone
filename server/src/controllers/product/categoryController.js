import { Category } from "../../models/index.js";

export const getAllCatagories = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).send(category);
  } catch (error) {
    console.log(`Error in getAllCatagories ${error}`);
    return res.status(405).send({ message: "Couldn't fetch Category" });
  }
};
