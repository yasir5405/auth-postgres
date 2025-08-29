import { client } from "./config";

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected.");
  } catch (error: any) {
    console.log("Error connecting to the database: ", error.message);
  }
};
