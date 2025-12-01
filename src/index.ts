// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/mongodb";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import authMiddleware from "./middleware/authMiddleware";
import limiter from "./middleware/rateLimitMiddleware";
import morgan from "morgan";
import IUserTokenPayload from "./interfaces/IUserTokenPayload";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload;
    }
  }
}

export const getEnv = () => {
  return {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    URI_DB: process.env.URI_DB,
  };
};

const envs = getEnv();
const PORT = envs.PORT;
console.log(PORT);

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (__: Request, res: Response): void => {
  res.json({ message: "Algo salio mal" });
});

app.use("/auth", limiter, userRouter);
app.use("/products", authMiddleware, productRouter);

// endpoint para el 404 - no se encuentra el recurso
app.use((__, res) => {
  res.status(404).json({ succes: false, error: "El recurso no se encuentra" });
});

// pongo en escucha el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`);
  connectDB();
});
