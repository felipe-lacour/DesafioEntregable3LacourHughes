import fs from 'fs';
import { __dirname } from '../utils.js';
import path from 'path';
import {v4 as uuidv4} from 'uuid';

export class CartManager {
  #productsPath = path.join(__dirname, `/json/productos.json`);
  constructor(fileName){
    this.path =  path.join(__dirname, `/json/${fileName}`);
  }

  #getContent = async (path) => {
    try {
      const content = await fs.promises.readFile(path, 'utf-8');
      const result = JSON.parse(content)
      return result;
    } catch (error) {
      throw error
    }
  }

  fileExist(){
    return fs.existsSync(this.path)
  }

  createCart = async () => {
    try {
      const carts = await this.#getContent(this.path);
      const newCart = {
        id: uuidv4(),
        products: []
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
      return {status: 'success', data: newCart, message: `El carrito ha sido creado con exito, su id es: ${newCart.id}`};
    } catch (error) {
      throw error;
    }
  }

  getCart = async(id) => {
    try {
      const carts = await this.#getContent(this.path);
      const specificCart = carts.find(i=> i.id === id);
      if (specificCart){
        return {status: 'success', data: specificCart.products, message: `Productos del carrito id: ${specificCart.id}`}
      } else {
        throw {status: 'error', message: `No se ha podido encontrar un carrito con el id: ${id}`}
      }
    } catch (error) {
      throw error;
    }
  }

  addToCart = async(cid, pid) => {
    try {
      const carts = await this.#getContent(this.path);
      const products = await this.#getContent(this.#productsPath);
      const productExists = products.find(i => i.id === parseInt(pid));
      if(productExists){
        const cartIndex = carts.findIndex(i => i.id === cid);
        if(cartIndex >= 0){
          const itsInCart = carts[cartIndex].products.find(i => i.id === parseInt(pid));
          if(itsInCart){
            const updatedProducts = carts[cartIndex].products.map( i => {
              if(i.id === parseInt(pid)){
                return {...i, quantity: i.quantity + 1}
              } else {
                return i
              }
            })
            carts[cartIndex].products = updatedProducts;
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return {status: 'success', data: carts[cartIndex].products, message: `Producto con id ${pid} agregado al carrito ${cid}`}
          } else {
            carts[cartIndex].products.push({id: parseInt(pid), quantity: 1});
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return {status: 'success', data: carts[cartIndex].products, message: `Producto con id ${pid} agregado al carrito ${cid}`}
          }
        } else {
          throw {status: 'error', message: `Carrito con id ${cid} no encontrado`};
        }
      } else {
        throw {status: 'error', message: `Producto con id ${pid} no encontrado`};
      }
    } catch (error) {
      throw error
    }
  }
}