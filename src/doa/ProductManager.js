import fs from 'fs';
import { __dirname } from '../utils.js';
import path from 'path';

export class ProductManager {
  //! CONSTRUCTOR
  constructor(fileName){
    this.path = path.join(__dirname, `/json/${fileName}`);
  }
  //! METODOS
  fileExist(){
    return fs.existsSync(this.path)
  }

  addProduct = async ({title, description, price, thumbnails, code, stock, category,status}) => {
    const newProduct = {
      title: title,
      description: description,
      price: price,
      thumbnails: thumbnails,
      code: code,
      stock: stock,
      status: status,
      category: category
    }
    try {
      if(this.fileExist()){
        const content = await fs.promises.readFile(this.path, 'utf-8');
        const products = JSON.parse(content);
        const codeExist = products.some(i => i.code === code);
        if(!codeExist){
          if(!products.length){
            newProduct.id = 1;
          } else {
            newProduct.id = products[products.length - 1].id + 1;
          }
          products.push(newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
          return {status: 'success', data: products, message: 'Producto Creado'};
        } else {
          throw {status: 'error', message: `ERROR: El producto con el codigo: ${code}, ya existe.`};
        }
      } else {
        newProduct.id = 1;
        await fs.promises.writeFile(this.path, JSON.stringify([newProduct], null, '\t'));
        return {status: 'success', data: newProduct, message: 'Producto Creado'};
      }
    } catch (error) {
      throw error
    }
  }

  getProducts = async () => {
    try {
      if(!this.fileExist()) return console.log([]);
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      return products;
    } catch (error) {
      throw error;
    }
  }

  getProductById = async (id) => {
    try {
      const content = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(content);
      const productoExiste = products.find(i => i.id === id);
      if(productoExiste){
        return productoExiste;
      } else {
        throw {status: 'error', message: `No existe un producto con el id: ${id}`};
      };
    } catch (error) {
      throw error;
    };
  }

  updateProduct = async (id, newContent) => {
    const parsedId = parseInt(id);
    try {
      let index;
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      const productoExiste = products.find(i => i.id === parsedId);
      if(productoExiste) {
        index = products.findIndex(i => i.id === parsedId);
        const updatedProducts = products.map(i => {
          if(i.id === parsedId){
            const newProduct = {...newContent, id: i.id};
            return newProduct;
          } else {
            return i;
          }
        })
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, '\t'));
        return {status: 'success', data: updatedProducts[index], message: 'Producto Actualizado'};
      } else {
        throw {status: 'error', message: `No existe un producto con el id: ${id}`};
      }
    } catch (error) {
      throw error;
    }
  }

  deleteProduct = async (id) => {
    const parsedId = parseInt(id);
    try {
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      const productoExiste = products.find(i => i.id === parsedId);
      if(productoExiste){
        const updatedProducts = products.filter(i => i.id !== parsedId);
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, '\t'));
        return {status: 'success', message: 'Producto eliminado con exito.', data: updatedProducts};
      } else {
        throw {status: 'error', message: `No existe un producto con el id: ${id}`}
      };
    } catch (error) {
      throw error;
    }
  }
}