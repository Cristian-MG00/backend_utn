// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, response, Response } from "express";
import cors from "cors";
import connectDB from "./config/mongodb";
import productRouter from "./routes/productRoutes";
import userRouter from "./routes/userRoutes";
import limiter from "./middleware/rateLimitMiddleware";
import morgan from "morgan";
import IUserTokenPayload from "./interfaces/IUserTokenPayload";
import dotenv from "dotenv";
import transporter from "./config/emailConfig";
import createTemplate from "./templates/emailTemplate";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload;
    }
  }
}

// export const getEnv = () => {
//   return {
//     PORT: process.env.PORT,
//     JWT_SECRET: process.env.JWT_SECRET,
//     URI_DB: process.env.URI_DB,
//   };
// };

// const envs = getEnv();
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (__: Request, res: Response) => {
  res.json({ status: true });
});

app.use("/auth", limiter, userRouter);
app.use("/products", productRouter);

// enviar correo electronico
app.post("/email/send", async (req, res) => {
  const { subject, email: emailUser, message } = req.body;
  if (!subject || !emailUser || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Todos los campos son requeridos" });
  }

  try {
    const info = await transporter.sendMail({
      from: `Mensaje de la tienda: ${emailUser}`,
      to: process.env.EMAIL_USER,
      subject,
      html: createTemplate(emailUser, message),
    });

    return res.json({
      success: true,
      message: "Correo fue enviado exitosamente",
      info,
    });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ success: false, error: error.message });
  }
});

// endpoint para el 404 - no se encuentra el recurso
app.use((__, res) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra" });
});

// pongo en escucha el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`);
  connectDB();
});
