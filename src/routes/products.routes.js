import { Router } from "express";
import { ProductManager } from "../doa/ProductManager.js";
const felipeManager = new ProductManager('productos.json');
const router = Router();

const validation = (req, res, next) => {
  const newProduct = req.body;
  if(!newProduct.status){
    newProduct.status = true;
  }
  if(!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category){
    res.json({status: 'error', message: 'ERROR: Datos faltantes'})
  } else {
    next();
  }
};

router.get(
  "/",
  async (req, res) => {
    try {
      const {limit} = req.query;
      const productos = await felipeManager.getProducts();
      let result = [];
      if(!limit || productos.length <= limit){
        result = productos;
      } else {
        for(let i = 0; i < limit; i++){
          result.push(productos[i]);
        }
      }
      res.send(result);
    } catch (error) {
      res.status(error.status).json(error)
    }
  }
);

router.get(
  "/:pid",
  async (req, res) => {
    try {
      const id = parseInt(req.params.pid);
      const producto = await felipeManager.getProductById(id);
      res.send(producto);
    } catch (error) {
      res.json(error)
    }
  }
);

router.post(
  "/",
  validation,
  async (req, res) => {
    try {
      const addingProduct = await felipeManager.addProduct(req.body);
      res.json(addingProduct);
    } catch (error) {
      res.json(error)
    }
  }
);

router.put(
  "/:pid",
  validation,
  async (req, res) => {
    try {
      const updatingProduct = await felipeManager.updateProduct(req.params.pid, req.body)
      res.json(updatingProduct);
    } catch (error) {
      res.json(error)
    }
  }
);

router.delete(
  "/:pid",
  async (req, res) => {
    try {
      const deletingProduct = await felipeManager.deleteProduct(req.params.pid);
      res.json(deletingProduct);
    } catch (error) {
      res.json(error)
    }
  }
);

export {router as productsRouter};