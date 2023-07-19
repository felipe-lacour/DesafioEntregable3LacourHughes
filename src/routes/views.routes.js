import { Router } from "express";
import { ProductManager } from "../doa/ProductManager.js";
const manager = new ProductManager('productos.json');
const router = Router();

const handleHTTP = (io) => {
  router.get(
    '/',
    async (req, res) => {
      try {
        const products = await manager.getProducts();
        res.render(
          "home",
          {products, stlye: "home.css"}
        );
      } catch (error) {
        res.status(error.status).json(error);
      }
    }
  );
  
  router.get(
    "/realtimeproducts",
    async (req, res) => {
      try {
        const products = await manager.getProducts();
        res.render("realTimeProducts", {script: "js/realTimeProducts.js", products});
      } catch (error) {
        res.status(error.status).json(error);
      }
    }
  );

  io.on("connection", (socketConnected) => {
    console.log(`Cliente con id ${socketConnected.id}`)
    socketConnected.on('productEvent', async(data) => {
      try {
        data.thumbnails = [];
        data.status = true;
        const products = await manager.addProduct(data)
        io.emit('cambiosProductos', products.data);
      } catch (error) {
        res.status(error.status).json(error);
      }
    })

    socketConnected.on('productDelete', async(data) => {
      try {
        const products = await manager.deleteProduct(data)
        io.emit('productDeleted', products.data)
      } catch (error) {
        res.status(error.status).json(error);
      }
    })
  });

  return router
}


export {handleHTTP}