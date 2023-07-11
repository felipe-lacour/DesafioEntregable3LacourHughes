import express from "express";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.listen(
  port,
  () => console.log(`El servidor esta escuchando al puerto ${port}`)
)

app.use(
  "/api/products",
  productsRouter
);

app.use(
  "/api/carts",
  cartsRouter
)