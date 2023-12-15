import mongoose from "mongoose";
require("dotenv").config();

const DB_HOST = process.env.DB_HOST as string;
const DB_PORT = process.env.DB_PORT as string;
const DB_NAME = process.env.DB_NAME_DEV as string;
const MONGO_URL = `${DB_HOST}://${DB_PORT}/${DB_NAME}`;
console.log(MONGO_URL);

mongoose.set("strictQuery", false);
// mongoose.connect(MONGO_URL);
const connectDB = async () => {
     try {
          mongoose.set("strictQuery", false);
          await mongoose.connect(MONGO_URL);
     } catch (err: any) {
          console.error(err.message);
          process.exit(1);
     }
};
connectDB();
export default mongoose;
