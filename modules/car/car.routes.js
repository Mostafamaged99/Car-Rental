import { Router } from "express";
import { addCar, availableCars, carsWithSameNames, deleteCar, getAllCars, getAvailableOrRentedSpecificnameCars, getCar, getCarsByNames, updateCar } from "./car.controller.js";

const carRouter = Router();

carRouter.post('/addCar',addCar);
carRouter.get('/getCar/:id',getCar);
carRouter.put('/updateCar/:id',updateCar);
carRouter.delete('/deleteCar/:id',deleteCar);
carRouter.get('/getAllCars',getAllCars);
carRouter.get('/',getCarsByNames);
carRouter.get('/availableCars/:name',availableCars);
carRouter.get('/carsWithSameNames/:name',carsWithSameNames);
carRouter.get('/getAvailableOrRentedSpecificnameCars',getAvailableOrRentedSpecificnameCars);


export default carRouter;