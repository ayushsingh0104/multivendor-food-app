
import mongoose from "mongoose";
import dotenv from "dotenv";
import { food_list } from "./utils/foodData.js";
import foodModel from './models/foodModel.js';


dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

async function seedData() {
  try {
    await foodModel.deleteMany({});
    await foodModel.insertMany(food_list);
    console.log("Food data seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}
