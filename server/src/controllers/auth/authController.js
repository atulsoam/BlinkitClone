import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../../models/index.js";
import "dotenv/config.js";

const generateToken = async (user) => {
  const accesToken = jwt.sign(
    { userID: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRATE,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { userID: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRATE,
    { expiresIn: "1d" }
  );

  return { accesToken, refreshToken };
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }

    const { accesToken, refreshToken } = await generateToken(customer);
    res.status(200).send({
      message: "Login succesfully",
      accesToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    console.log(`Error in loginCustomer ${error}`);
    return res.status(405).send({ message: "Login Failed" });
  }
};

export const loginDeliverPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).send({ message: "DeliveryPartner not found" });
    }
    const ismatch = password === deliveryPartner.password;
    if (!ismatch) {
      return res.status(400).send({ message: "DeliveryPartner not valid!" });
    }
    const { accesToken, refreshToken } = await generateToken(deliveryPartner);
    res.status(200).send({
      message: "Login succesfully",
      accesToken,
      refreshToken,
      deliveryPartner,
      
    });
  } catch (error) {
    console.log(`Error in loginDeliverPartner ${error}`);
    return res.status(405).send({ message: "Login Failed" });
  }
};

export const refresnTokenCustomerDeliveryPartner = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(404).send({ message: "refresh Token required" });
    }

    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRATE);
    let user;
    if (decode.role === "Customer") {
      user = await Customer.findById(decode.userID);
    } else if (decode.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decode.userID);
    } else {
      return res.status(403).send({ message: "Invalid Token or role" });
    }
    if (!user) {
      return res.status(403).send({ message: "Invalid Token" });
    }
    const { accesToken, refreshToken: newRefreshToken } = await generateToken(
      user
    );

    res.status(200).send({
      message: "Token Refreshed",
      accesToken,
      newRefreshToken,
      user,
    });

    return res.status(200).send({ message: "refresh Token Failed" });
  } catch (error) {
    console.log(`Error in refresnTokenCustomerDeliveryPartner ${error}`);
    return res.status(405).send({ message: "refresh Token Failed" });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { userID, role } = req.user;
    let user;
    if (role === "Customer") {
      user = await Customer.findById(userID);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userID);
    } else {
      return res.status(403).send({ message: "Invalid Token or role" });
    }
    if (!user) {
      return res.status(403).send({ message: "Invalid user" });
    }
    res.status(200).send({
      message: "User fetched ",
      user,
    });
  } catch (error) {
    console.log(`Error in fetchUser ${error}`);
    return res.status(500).send({ message: "An error occured" });
  }
};
