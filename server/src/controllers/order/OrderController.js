import {
  Branch,
  Customer,
  DeliveryPartner,
  Order,
} from "../../models/index.js";

export const CreateOrder = async (req, res) => {
  try {
    const { userID } = req.user;

    const { items, branch, totalPrice, addressId, razorpay_payment_id } =
      req.body;

    const customerData = await Customer.findById(userID);
    const branchData = await Branch.findById(branch);
    if (!customerData || !branchData) {
      return res.status(500).send({ message: "Something went worng" });
    }
    console.log(customerData.address);

    const address = customerData.address.find(
      (addr) => addr._id.toString() === addressId
    );
    console.log(address, addressId, 22);

    if (!address) {
      return res.status(400).send({ message: "Address not found" });
    }

    const newOrder = new Order({
      customer: userID,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch: branch,
      totalPrice: totalPrice,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: address.address || "No Address found",
      },
      pickupLocation: {
        latitude: branchData.liveLocation.latitude,
        longitude: branchData.liveLocation.longitude,
        address: branchData.address || "No Address found",
      },
      razorpay_payment_id: razorpay_payment_id,
    });

    await newOrder.save();

    return res.status(201).send(newOrder);
  } catch (error) {
    console.log(`Error in CreateOrder ${error}`);
    return res.status(405).send({ message: "Couldn't make order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { userID } = req.user;
    const { orderId } = req.params;

    const { status, deliveryPersonLocation } = req.body;

    const UserData = await DeliveryPartner.findById(userID);
    if (!UserData) {
      return res
        .status(404)
        .send({ message: "Couldn't found delivery person" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Couldn't found order" });
    }
    if (["cancelled", "delivered"].includes(order.status)) {
      return res.status(404).send({ message: "Couldn't update order status" });
    }
    if (!order.deliveryPartner) {
      return res.status(403).send({ message: "Order still not confirmed" });
    }
    console.log(userID);
    console.log(order.deliveryPartner.toString());

    if (order.deliveryPartner.toString() !== userID) {
      // Add parentheses to invoke the method
      return res.status(403).send({ message: "Unauthorized access" });
    }

    order.status = status;
    order.deliveryPersonLocation = deliveryPersonLocation;
    await order.save();
    const orderTosend = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );

    req.server.io.to(orderId).emit("liveTrackingUpdates", orderTosend);
    return res.status(200).send(orderTosend);
  } catch (error) {
    console.log(`Error in updateOrderStatus ${error}`);
    return res.status(405).send({ message: "Couldn't update order" });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userID } = req.user;
    const { deliveryPersonLocation } = req.body;
    console.log(userID);
    console.log(deliveryPersonLocation);
    console.log(orderId);

    const deliverpersonData = await DeliveryPartner.findById(userID);

    if (!deliverpersonData) {
      return res.status(405).send({ message: "delivery person not found" });
    }
    const orderData = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );

    if (!orderData) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (orderData.status !== "available") {
      return res.status(405).send({ message: "Order already confirmed" });
    }

    orderData.status = "confirmed";
    orderData.deliveryPartner = userID;
    orderData.deliveryPersonLocation = {
      latitude: deliveryPersonLocation.latitude,
      address: deliveryPersonLocation.address || "No Address found",
      longitude: deliveryPersonLocation.longitude,
    };
    req.server.io.to(orderId).emit("orderConfirmed", orderData);
    await orderData.save();
    return res.status(200).send(orderData);
  } catch (error) {
    console.log(`Error in confirmOrder ${error}`);
    return res.status(405).send({ message: "Couldn't confirm order" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.body;

    let querry = {};
    if (status) {
      querry.status = status;
    }
    if (customerId) {
      querry.customer = customerId;
    }
    if (deliveryPartnerId) {
      querry.deliveryPartner = deliveryPartnerId;
    }
    if (branchId) {
      querry.branch = branchId;
    }

    const orders = await Order.find(querry).populate(
      "customer branch items.item deliveryPartner"
    );

    return res.status(200).send(orders);
  } catch (error) {
    console.log(`Error in getOrder ${error}`);
    return res.status(405).send({ message: "Couldn't fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orders = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );
    if (!orders) {
      return res.status(404).send({ message: "Order not found" });
    }
    return res.status(200).send(orders);
  } catch (error) {
    console.log(`Error in getOrderById ${error}`);
    return res.status(405).send({ message: "Couldn't fetch order by id" });
  }
};
