import { ObjectId } from "mongodb";
import { db } from "../../database/dbConnections.js";

const addCar = async (req, res) => {
  try {
    let car = await db.collection("cars").insertOne(req.body);
    res.status(201).json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCar = async (req, res) => {
  try {
    let car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCar = async (req, res) => {
  try {
    let car = await db
      .collection("cars")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.status(200).json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    let car = await db
      .collection("cars")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ message: "success", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCars = async (req, res) => {
  try {
    let cars = await db.collection("cars").find().toArray();
    res.status(200).json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCarsByNames = async (req, res) => {
  try {
    const { names } = req.query;
    if (!names) {
      return res.status(400).json({ message: "names are required" });
    }
    const nameArr = names.split(",").map((name) => name.trim());
    const cars = await db
      .collection("cars")
      .find({ name: { $in: nameArr } })
      .toArray();
    // console.log(cars);
    // console.log(nameArr);
    res.status(200).json({ message: "success", cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const availableCars = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    const cars = await db
      .collection("cars")
      .find({ name: name, rentalStatus: "available" })
      .toArray();
    if (cars.length == 0) {
      return res.status(404).json({ message: "No cars available" });
    }
    return res.status(200).json({ message: "success", cars });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const carsWithSameNames = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    const cars = await db
      .collection("cars")
      .find({ $or: [{ name: name }, { rentalStatus: "rented" }] })
      .toArray();
    return res.status(200).json({ message: "success", cars });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAvailableOrRentedSpecificnameCars = async (req, res) => {
  try {
    const { names, specificName } = req.query;
    if (!names || !specificName) {
      return res.status(400).json({ message: "names and specificName are required" });
    }
    const nameArr = names.split(",").map(name => name.trim());
    const cars = await db.collection("cars").find({
      $or: [
        { name: { $in: nameArr }, rentalStatus: "available" },
        { name: specificName, rentalStatus: "rented" }
      ]
    }).toArray();
    res.status(200).json({ message: "Success", cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  addCar,
  getCar,
  getAllCars,
  updateCar,
  deleteCar,
  getCarsByNames,
  availableCars,
  carsWithSameNames,
  getAvailableOrRentedSpecificnameCars
};
