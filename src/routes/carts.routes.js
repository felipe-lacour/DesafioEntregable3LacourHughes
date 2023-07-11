import { Router } from "express";
import { CartManager } from "../doa/CartManager.js";
const cartAdmin = new CartManager("cart.json")
const router = Router();

router.post(
  "/",
  async (req, res) => {
    try {
      const creatingCart = await cartAdmin.createCart();
      res.json(creatingCart);
    } catch (error) {
      res.json(error)
    }
  }
);

router.get(
  "/:cid",
  async (req, res) => {
    try {
      const cid = req.params.cid
      const getCart = await cartAdmin.getCart(cid);
      res.json(getCart)
    } catch (error) {
      res.json(error)
    }
  }
)

router.post(
  "/:cid/product/:pid",
  async (req, res) => {
    try {
      const {cid, pid} = req.params;
      const addingProduct = await cartAdmin.addToCart(cid, pid);
      res.json(addingProduct)
    } catch (error) {
      res.json(error);
    }
  }
)

export {router as cartsRouter}