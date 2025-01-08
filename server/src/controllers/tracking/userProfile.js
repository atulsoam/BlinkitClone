import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;

    const { updatedData } = req.body;

    const user =
      (await Customer.findById(userID)) ||
      (await DeliveryPartner.findById(userID));

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      return res.status(400).send({ message: "User role is not specified" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(500).send({ message: "Failed to update user" });
    }

    return res
      .status(200)
      .send({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
