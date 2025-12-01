// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y Y EL RESPONSE SIEMPRE ESTARAN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express";
import Product from "../model/ProductModel";
import { Types } from "mongoose";

class ProductController {
  static getAllProducts = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const products = await Product.find();
      res.json({ succes: true, data: products });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ succes: false, error: error.message });
    }
  };
  static getProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ succes: false, error: "ID invalido" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ succes: false, error: "Producto no encontrado" });
      }

      res.json({ succes: true, data: product });
    } catch (e) {
      const error = e as Error;
      res.status(400).json({
        succes: false,
        error: error.message,
      });
    }
  };
  static addProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      // destructuro las propiedades de body
      const { name, category, price, stock, description } = body;
      // validacion basica
      if (!name || !category || !price || !stock || !description) {
        return res
          .status(400)
          .json({ succes: false, error: "Datos invalidos" });
      }

      const newProduct = new Product({
        name,
        category,
        price,
        stock,
        description,
      });

      await newProduct.save();

      res.status(201).json({
        succes: true,
        data: newProduct,
      });
    } catch (error) {
      res
        .status(500)
        .json({ succes: false, error: "Error interno del servidor" });
    }
  };
  static updateProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const id = req.params.id; // agarro el id de los parametros en string
      const body = req.body; // agarro los nuevos datos del body para actualizar

      // valido que sea un id valido
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ succes: false, error: "ID invalido" });
      }

      const { name, category, price, stock, description } = body; // destructuro las propiedades

      const updates = { name, category, price, stock, description };

      const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
        new: true,
      });

      // valido que exista un producto con ese id
      if (!updatedProduct) {
        return res
          .status(400)
          .json({ succes: false, error: "Producto no encontrado" });
      }

      res.json({
        succes: true,
        data: updatedProduct,
      });
    } catch (e) {
      res
        .status(500)
        .json({ succes: false, error: "Error interno del servidor" });
    }
  };
  static deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        res.status(404).json({ succes: false, error: "El producto no existe" });
        return;
      }

      res.json({
        succes: true,
        data: deletedProduct,
      });
    } catch (e) {
      // const error = e as Error;
      res
        .status(500)
        .json({ succes: false, error: "Error interno del servidor" });
    }
  };
}

export default ProductController;
