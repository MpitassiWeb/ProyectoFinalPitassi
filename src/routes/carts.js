import { Router } from "express";
import { cartModel } from "../models/carts.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let carts = await cartModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log("Cannot get products:", error);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    let { cid } = req.params;
    let result = await cartModel.findOne({ _id: cid });
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(404).send({ status: "error", payload: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await cartModel.create({
      products: [],
    });
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    let product = {
      id: pid,
      quantity: 1,
    };
    const cart = await cartModel.findOne({ _id: cid });
    if (cart.products != []) {
      product = [...cart.products, product];
    }
    const existe = cart.products.findIndex((product) => product.id === pid);
    if (existe !== -1) {
      product.quantity = product.quantity + 1;
    }
    let result = await cartModel.updateOne(
      { _id: cid },
      { $set: { products: product } }
    );
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.send({ status: "error", error });
  }
});

export default router;
