import { MongoClient, Db } from "mongodb";
import { EmailData } from "./types";

let client: MongoClient;
let db: Db;

async function connectToDatabase(): Promise<Db> {
  if (!client) {
    try {
      client = new MongoClient(`mongodb://localhost:27017`);
      await client.connect();
      console.log("Connected successfully to MongoDB");

      db = client.db(`config`);

      // Verify the connection
      await db.command({ ping: 1 });
      console.log("Database connection verified");

      // Set up a connection error listener
      client.on("error", (error) => {
        console.error("MongoDB connection error:", error);
        // Attempt to reconnect
        setTimeout(connectToDatabase, 5000);
      });

      // Set up a connection close listener
      client.on("close", () => {
        console.log("MongoDB connection closed. Attempting to reconnect...");
        setTimeout(connectToDatabase, 5000);
      });
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      throw error;
    }
  }
  return db;
}

export async function insertEmail(emailData: EmailData): Promise<void> {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("test");
    await collection.insertOne(emailData);
    console.log("Email inserted into database");
  } catch (error) {
    console.error("Error inserting email into database:", error);
    throw error;
  }
}

// Function to close the database connection
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log("Database connection closed");
  }
}

// Initial connection
connectToDatabase().catch(console.error);
