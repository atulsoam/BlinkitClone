import mongoose from "mongoose";
export const ConnectToMongoDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log(`Db Connected`);
    
  } catch (error) {
    console.log(`error in ConnectToMongoDB ${error}`);
  }
};
