import { connect } from "mongoose";
import { getEnv } from "..";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  const envs = getEnv();
  const URI_DB = envs.URI_DB!;
  console.log(URI_DB, "<- la URI_DB");
  try {
    await connect(URI_DB);
    console.log("✅ Conectado a Mongo DB con Éxito!");
  } catch (e) {
    console.log("❌ Error al conectarse Mongo DB");
    process.exit(1);
  }
};

export default connectDB;
