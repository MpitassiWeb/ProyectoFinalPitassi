import { Router } from "express";
import { productModel } from "../models/products.js";
import socketServer from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { limit = 5 } = req.query;
    let products = await productModel.paginate({}, { limit: limit, page: page });
    res.send({ result: "success", payload: products });
  } catch (error) {
    console.log("Cannot get products:", error);
  }
});

router.get("/limit/:limit/page/:page", async (req, res) => {
  try {
    let products = await productModel.find();
    res.send({ result: "success", payload: products });
  } catch (error) {
    console.log("Cannot get products:", error);
  }
});

router.get("/view", async (req, res) => {
  try {
    let products = await productModel.find().lean();
    console.log(products);
    res.render("home", { products });
  } catch (error) {
    console.log("Cannot get products:", error);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await productModel.find();
    res.render("realTimesProducts", { products });
  } catch (error) {
    console.log("Cannot get products:", error);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    let result = await productModel.findOne({ _id: pid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(404).send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    let { title, description, code, price, status, stock, thumbnails } =
      req.body;

    if (!thumbnails) {
      thumbnails = [];
    }

    if (!status) {
      status = true;
    }

    if (!title || !description || !code || !price || !status || !stock) {
      return res
        .status(422)
        .send({ status: "error", error: "valores incompletos" });
    }

    const result = await productModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
    });
    //socketServer.sockets.emit("productsRealTimes", { products });
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", error });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    let productToReplace = req.body;
    if (!productToReplace.thumbnails) {
      productToReplace.thumbnails = [];
    }

    if (!productToReplace.status) {
      productToReplace.status = true;
    }

    if (
      !productToReplace.title ||
      !productToReplace.description ||
      !productToReplace.code ||
      !productToReplace.price ||
      !productToReplace.status ||
      !productToReplace.stock
    ) {
      return res
        .status(422)
        .send({ status: "error", error: "valores incompletos" });
    }
    const result = await productModel.updateOne({ _id: pid }, productToReplace);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", error });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    let { pid } = req.params;
    let result = await productModel.deleteOne({ _id: pid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(404).send({ status: "error", payload: error });
  }
});

export default router;
