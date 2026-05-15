import mongoose from "mongoose";

export async function connectDB() {
  const url = process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

  try {
    await mongoose.connect(url, {
      dbName: "jsd12-express-app",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // process.exit(1);
    throw error;
  }
}
