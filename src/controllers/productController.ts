// FUNCIONES QUE SANITIZAN DATOS DE ENTRADA Y RESPONDEN AL CLIENTE
// LA REQUEST Y Y EL RESPONSE SIEMPRE ESTARAN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express";
import Product from "../model/ProductModel";
import { Types } from "mongoose";
import {
  createProductSchema,
  updatedProductSchema,
} from "../validators/productValidator";

class ProductController {
  static getAllProducts = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { name, stock, category, minPrice, maxPrice } = req.query;

      const filter: any = {};

      if (name) filter.name = new RegExp(String(name), "i");
      if (stock) filter.stock = Number(stock);
      if (category) filter.category = new RegExp(String(category), "i");
      if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) filter.price.$gte = minPrice;
        if (maxPrice) filter.price.$lte = maxPrice;
      }

      const products = await Product.find(filter);
      res.json({ succes: true, data: products });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ succes: false, error: error.message });
    }
  };
  static getProduct = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID inválido" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ succes: false, error: "Producto no encontrado" });
      }

      res.status(200).json({ succes: true, data: product });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }
  };
  static addProduct = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { body } = req;
      const { name, category, price, stock, description } = body;
      if (!name || !category || !price || !stock || !description) {
        return res
          .status(400)
          .json({ succes: false, error: "Todos los campos son requeridos" });
      }

      const validator = createProductSchema.safeParse(body);

      if (!validator.success) {
        return res.status(400).json({
          succes: false,
          error: validator.error.flatten().fieldErrors,
        });
      }

      const newProduct = new Product(validator.data);

      await newProduct.save();

      res.status(201).json({
        succes: true,
        data: newProduct,
      });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };

  static updateProduct = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;
      const { body } = req;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID inválido" });
      }

      const validator = updatedProductSchema.safeParse(body);

      if (!validator.success) {
        return res.status(400).json({
          success: false,
          error: validator.error.flatten().fieldErrors,
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        validator.data,
        {
          new: true,
        }
      );

      // valido que exista un producto con ese id
      if (!updatedProduct) {
        return res
          .status(400)
          .json({ success: false, error: "Producto no encontrado" });
      }

      res.json({
        success: true,
        data: updatedProduct,
      });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };
  static deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<void | Response> => {
    try {
      const id = req.params.id;

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res
          .status(404)
          .json({ succes: false, error: "El producto no encontrado" });
      }

      res.json({
        success: true,
        data: deletedProduct,
      });
    } catch (e) {
      const error = e as Error;
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

export default ProductController;
