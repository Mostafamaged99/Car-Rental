import { ObjectId } from "mongodb";
import { db } from "../../database/dbConnections.js";

const signup = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await db.collection("users").findOne({ email });
    if (user) {
      return res.status(500).json({ message: "Email already exists" });
    }

    user = await db.collection("users").insertOne(req.body);
    res.status(201).json({ message: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "user not found" });
    }
    if (password != user.password) {
      return res.status(404).json({ message: "wrong password" });
    }
    res.status(200).json({ message: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const allUsers = async (req, res) => {
  try {
    let users = await db.collection("users").find().toArray();
    res.status(200).json({ message: "success", users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    let user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ message: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.status(200).json({ message: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json({ message: "success", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { signup, signin, allUsers, getUser, updateUser, deleteUser };
