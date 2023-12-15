import { MongoClient, Db } from "mongodb";
import mongoose from "../config/db";

export async function clearDatabase(): Promise<void> {
     const collections = await mongoose.connection.db.listCollections().toArray();
     // Iterate through each collection and remove all documents
     for (const collection of collections) {
          await mongoose.connection.db.collection(collection.name).deleteMany({});
          //   console.log(`Collection ${collection.name} cleared.`);
     }
     console.log("Database cleared.");
}
