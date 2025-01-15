import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;
    const { updatedData } = req.body;

    console.log(updatedData);

    // Fetch the user (Customer or DeliveryPartner)
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

    // Check if address is part of updatedData for Customer role
    if (user.role === "Customer" && updatedData.address) {
      // Logic to check if an address with the same id exists

      if (updatedData.address?.isSelected) {
        // First, set isSelected = false for all addresses
        user.address.forEach((address) => {
          address.isSelected = false;
        });
      }
      const existingAddressIndex = user.address.findIndex(
        (addr) => addr.id === updatedData.address.id
      );

      if (existingAddressIndex > -1) {
        // Address with matching ID found, update it
        user.address[existingAddressIndex] = updatedData.address;
      } else {
        // Address with matching ID not found, push new address
        user.address.push(updatedData.address);
      }

      // Assign the updated address list back to updatedData
      updatedData.address = user.address;
    }

    // Perform the update for the user document
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
