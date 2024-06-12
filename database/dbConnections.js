import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
  })
  .catch(() => {
    console.log("database error");
  });


export const db = client.db('Car-Rental-System')