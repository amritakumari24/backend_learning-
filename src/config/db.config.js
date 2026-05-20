import { webcrypto } from "node:crypto";

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
  });
}

const { default: mongoose } = await import("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database Connection Error:", error.message);

    if (error.message.toLowerCase().includes("bad auth")) {
      console.error(
        "MongoDB authentication failed. Check the username, password, and Atlas access settings in MONGODB_URI."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
