import { Router } from "express";
import { allUsers, deleteUser, getUser, signin, signup, updateUser } from "./user.controller.js";

const userRouter = Router();
userRouter.post('/signup',signup)
userRouter.post('/signin',signin)
userRouter.get('/allUsers',allUsers)
userRouter.get('/getUser/:id',getUser)
userRouter.put('/updateUser/:id',updateUser)
userRouter.delete('/deleteUser/:id',deleteUser)


export default userRouter;