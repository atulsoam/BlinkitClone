import { DeliveryPartner, Order } from "../../models/index.js";

export const UpdtaeDeliveryPersonLocation = async (
  orderId,
  userID,
  UpdatedLocation,
  io
) => {
  try {
    const deliverpersonData = await DeliveryPartner.findById(userID);

    if (!deliverpersonData) {
      return false;
    }
    const orderData = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );
    if (!orderData) {
      return false;
    }

    orderData.deliveryPersonLocation = {
      latitude: UpdatedLocation.latitude,
      longitude: UpdatedLocation.longitude,
    };
    io.to(orderId).emit("locationUpdates", orderData);
    io.to(orderId).emit("orderUpdates", orderData);

    await orderData.save();
    return true;
  } catch (error) {
    console.log(`Error in UpdtaeDeliveryPersonLocation ${error}`);
    return false;
  }
};

export const SendLiveUpdatedToClient = async (orderId, io) => {
  try {
    const orderData = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );

    if (!orderData) {
      return false;
    }

    io.to(orderId).emit("orderUpdates", orderData);
    console.log("sent updates to orderUpdates", orderId);

    return orderData;
  } catch (error) {
    console.log(`Error in SendLiveUpdatedToClient ${error}`);
    return false;
  }
};
