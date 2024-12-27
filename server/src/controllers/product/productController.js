import { Product } from "../../models/index.js";

export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(405).send({ message: "category can't be null" });
    }

    const products = await Product.find({category:category}).select("-category").exec();
    return res.status(200).send(products)
  } catch (error) {
    console.log(`Error in getProductByCategory ${error}`);
    return res.status(405).send({ message: "Couldn't fetch products" });
  }
};
