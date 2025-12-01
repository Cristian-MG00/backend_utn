// DEFINE EL ESQUEMA DE DATOS Y CREA EL MODELO
// EL MODELO:
// 1 - Crea la coleccion en mongoDB
// 2 - Habilita los metodos de manipulacion de data

import { model, Model, Schema } from "mongoose";
import IProduct from "../interfaces/IProduct";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, default: "No tiene categoria" },
    price: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "No tiene descripcion" },
  },
  {
    versionKey: false,
  }
);

const Product: Model<IProduct> = model("Product", productSchema);

export default Product;
