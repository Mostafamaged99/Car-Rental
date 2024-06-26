import { ObjectId } from "mongodb";
import { db } from "../../database/dbConnections.js";

const createRental = async (req, res) => {
  try {
    const { carId, userId, startDate, returnDate } = req.body;
    const car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(carId) });
    if (!car) {
      return res.status(404).json({ message: "car not found" });
    }
    if (car.rentalStatus == "rented") {
      return res.status(400).json({ message: "car already rented" });
    }
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const rental = {
      carId: new ObjectId(carId),
      userId: new ObjectId(userId),
      startDate,
      returnDate,
    };
    const result = await db.collection("rentals").insertOne(rental);
    await db
      .collection("cars")
      .updateOne(
        { _id: new ObjectId(carId) },
        { $set: { rentalStatus: "rented" } }
      );

    const createdRental = await db
      .collection("rentals")
      .aggregate([
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "car",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ])
      .toArray();

    return res
      .status(201)
      .json({ message: "Rental created successfully", createdRental });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateRental = async (req, res) => {
  try {
    const rental = await db
      .collection("rentals")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
    }
    const updatedRental = await db
      .collection("rentals")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    return res.status(200).json({ message: "Rental updated", updatedRental });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteRental = async (req, res) => {
  try {
    const rental = await db
      .collection("rentals")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!rental) {
      res.status(404).json({ message: "Rental not found" });
    }
    const deletedRental = await db
      .collection("rentals")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    await db
      .collection("cars")
      .updateOne(
        { _id: new ObjectId(rental.carId) },
        { $set: { rentalStatus: "available" } }
      );
    return res.status(200).json({ message: "Rental deleted", deletedRental });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getRental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const rental = await db
      .collection("rentals")
      .aggregate([
        {
          $match: { _id: new ObjectId(rentalId) },
        },
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "car",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ])
      .toArray();

    if (rental.length === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }
    return res.status(200).json({ message: "Success", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await db
      .collection("rentals")
      .aggregate([
        {
          $lookup: {
            from: "cars",
            localField: "carId",
            foreignField: "_id",
            as: "car",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
      ])
      .toArray();
    return res.status(200).json({ message: "Success", rentals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createRental, updateRental, deleteRental, getRental, getAllRentals };
