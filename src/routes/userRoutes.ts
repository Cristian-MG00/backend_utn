// EL ROUTER VALIDA MÉTODOS Y RUTAS PROPIAS DE LA ENTIDAD

import { Router } from "express";
import UserController from "../controllers/userController";

const userRouter = Router();
// TODAS LAS PETICIONES QUE LLEGAN AL userRouter EMPIEZAN CON
// http://localhost:3000/auth

userRouter.post("/register", UserController.registerUser);

userRouter.post("/login", UserController.loginUser);

export default userRouter;
