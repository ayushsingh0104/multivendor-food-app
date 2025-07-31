import dns from "dns";
dns.setDefaultResultOrder('ipv4first');



import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
   "mongodb+srv://testuser:ayushmona100@cluster0.g2cn7.mongodb.net/foodDelivery?retryWrites=true&w=majority&appName=Cluster0"
  ).then(() => console.log("DataBase Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
}
