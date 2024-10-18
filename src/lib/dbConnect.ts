import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

// Initialize connection object
const connection: connectionObject = { isConnected: 0 };

async function dbConnect(): Promise<void> {

  // Check if there's an active connection
  if (connection.isConnected === 1) {
    console.log("Already Connected to Database");
    return;
  }

  try {
    // Connect to the database
    const db = await mongoose.connect(
      "mongodb+srv://himanshipatel0409:himanshi@cluster0.gozbdan.mongodb.net/",
      {
        dbName: "anonymous_pings",
      }
    );

    // Set the connection state
    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected successfully!");
  } catch (error) {
    console.error("Error from database connection:", error);
    process.exit(1); // Exit process on connection failure
  }
}

export default dbConnect;
