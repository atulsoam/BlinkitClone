import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;
    console.log(userID);
    
    const { updatedData } = req.body;

    const user =
      await Customer.findById(userID) ||
      await DeliveryPartner.findById(userID)

    if (!user) {
      return res.status(405).send({ message: "User Not found" });
    }
    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      return res.status(405).send({ message: "User Role is not specified" });
    }
    const userData = await userModel.findByIdAndUpdate(
      user._id,
      { $set: updatedData },
      { $new: true, $runValidators: true }
    );

    if (!userData) {
      return res.status(405).send({ message: "Update Failed" });
    }

    return res
      .status(200)
      .send({ message: "User Updated Succesfully", userData });
  } catch (error) {
    console.log(`Error in updateUser ${error}`);
    return res.status(405).send({ message: "Update Failed" });
  }
};
