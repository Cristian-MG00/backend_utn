import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/UserModel";
import jwt from "jsonwebtoken";
import { getEnv } from "..";
import dotenv from "dotenv";
dotenv.config();

class UserController {
  static registerUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      const { email, password } = body;

      if (!email || !password) {
        res.status(400).json({
          succes: false,
          error: "Debes ingresar todos los datos requeridos",
        });
        return;
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.status(409).json({
          succes: false,
          error: "El usuario ya existe en la base de datos",
        });
      }

      // if (typeof password != "string") {
      //   return res.status(400).json({
      //     succes: false,
      //     error: "La contraseña solo puede contener letras",
      //   });
      // }

      const hash = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hash });
      await newUser.save();

      res.status(201).json({ succes: true, data: newUser });

      res.json(body);
    } catch (error) {
      const e = error as Error;
      if (e.name === "MongoServerError") {
        res.status(409).json({ succes: false, error: "El usuario ya existe" });
      }
    }
  };

  static loginUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const envs = getEnv();
    const SECRET_KEY = envs.JWT_SECRET;
    console.log(SECRET_KEY, "<- SECRET_KEY");
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(400)
          .json({ succes: false, error: "Debes ingresar todos los datos" });
        return;
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ succes: false, error: "No autorizado" });
      }

      // validar la contraseña
      const isVlid = await bcrypt.compare(password, user.password);

      if (!isVlid) {
        return res.status(401).json({ succes: false, error: "No autorizado" });
      }

      // ✅ permiso especial -> sesion de uso
      // jsonwebtoken -> jwt

      // 1 - payload -> informacion publica que quiero compartir del usuario logueado
      // 2 - clave secreta -> firma que valida el token
      // 3 - opciones -> cuando expira

      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY!, {
        expiresIn: "2h",
      });

      res.json({ succes: true, token: token });

      // response.json({ message: "Usuario logueado :)" });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ succes: false, error: error.message });
    }
  };
}
export default UserController;
