import { Router } from "express";
import { createRental, deleteRental, getAllRentals, getRental, updateRental } from "./rental.controller.js";

const rentalRouter = Router();

rentalRouter.post("/createRental", createRental);
rentalRouter.put("/updateRental/:id", updateRental);
rentalRouter.delete("/deleteRental/:id", deleteRental);
rentalRouter.get("/getRental/:id", getRental);
rentalRouter.get("/getAllRentals", getAllRentals);

export default rentalRouter;
