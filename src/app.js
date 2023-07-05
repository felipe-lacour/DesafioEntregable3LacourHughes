import express from "express";
import { ProductManager } from "./ProductManager.js";

const felipeManager = new ProductManager('./productos.json');
const port = 8080;

const app = express();
app.listen(
  port,
  () => console.log(`El servidor esta escuchando al puerto ${port}`)
)

const addingProducts = async() => {
  try {
    await felipeManager.addProduct('iPhone 12', 'The iPhone 12 is a powerful and feature-packed smartphone.', 999.99, 'No Img', 'abc123', 50);
    await felipeManager.addProduct('Samsung Galaxy S21', 'The Samsung Galaxy S21 is a flagship Android smartphone with a stunning display.', 899.99, 'No Img', 'def456', 30);
    await felipeManager.addProduct('MacBook Pro', 'The MacBook Pro is a high-performance laptop with a sleek design and excellent battery life.', 1499.99, 'No Img', 'ghi789', 20);
    await felipeManager.addProduct('Sony PlayStation 5', 'The Sony PlayStation 5 is a next-generation gaming console with immersive graphics and fast loading times.', 499.99, 'No Img', 'jkl012', 15);
    await felipeManager.addProduct('Samsung QLED 4K TV', 'The Samsung QLED 4K TV offers stunning picture quality and a wide range of smart features.', 1299.99, 'No Img', 'mno345', 25);
    await felipeManager.addProduct('Bose QuietComfort 35 II', 'The Bose QuietComfort 35 II is a wireless noise-canceling headphone with exceptional sound quality.', 299.99, 'No Img', 'pqr678', 40);
    await felipeManager.addProduct('Canon EOS R5', 'The Canon EOS R5 is a professional mirrorless camera with high-resolution imaging capabilities.', 3799.99, 'No Img', 'stu901', 60);
    await felipeManager.addProduct('Fitbit Charge 4', 'The Fitbit Charge 4 is a fitness tracker with built-in GPS and heart rate monitoring.', 149.99, 'No Img', 'vwx234', 35);
    await felipeManager.addProduct('Nintendo Switch', 'The Nintendo Switch is a versatile gaming console that can be used both as a handheld device and a home console.', 299.99, 'No Img', 'yzab567', 45);
    await felipeManager.addProduct('Dyson V11 Absolute', 'The Dyson V11 Absolute is a cordless vacuum cleaner with powerful suction and advanced filtration.', 699.99, 'No Img', 'cde890', 55);
  } catch (error) {
    console.log(error.message)
  }
}

// addingProducts();

app.get(
  "/products",
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
      console.log(`ERROR: ${error.message}`);
    }
  }
);

app.get(
  "/products/:pid",
  async (req, res) => {
    try {
      const id = parseInt(req.params.pid);
      const producto = await felipeManager.getProductById(id);
      if(producto){
        res.send(producto);
      } else {
        const errorObj = {
          error: `ERROR: No existe un producto con id: ${id}`
        };
        res.send(errorObj);
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    }
  }
)