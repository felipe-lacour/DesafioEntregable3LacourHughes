import fs from 'fs';

 export class ProductManager {
  //! CONSTRUCTOR
  constructor(path){
    this.path = path;
  }
  //! METODOS
  fileExist(){
    return fs.existsSync(this.path)
  }

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    }
    try {
      if(this.fileExist()){
        const content = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(content)
        const codeExist = products.some(i => i.code === code)
        if(!codeExist){
          if(!products.length){
            newProduct.id = 1
          } else {
            newProduct.id = products[products.length - 1].id + 1
          }
          products.push(newProduct)
          await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
          console.log(`El producto con el codigo: ${code}, ha sido creado con exito! Su id es ${newProduct.id}`)
        } else {
          console.log(`ERROR: El producto con el codigo: ${code}, ya existe.`)
        }
      } else {
        newProduct.id = 1;
        await fs.promises.writeFile(this.path, JSON.stringify([newProduct], null, '\t'));
        console.log(`El producto con el codigo: ${code}, ha sido creado con exito! Su id es ${1}`)
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    }
  }

  getProducts = async () => {
    try {
      if(!this.fileExist()) return console.log([])
      const content = await fs.promises.readFile(this.path, 'utf-8')
      const products = JSON.parse(content)
      return products
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
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
        console.log(`ERROR: No existe un producto con el id: ${id}`);
      };
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    };
  }

  updateProduct = async (id, field, newContent) => {
    try {
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      const productoExiste = products.find(i => i.id === id);
      if(productoExiste) {
        const updatedProducts = products.map(i => {
          if(i.id === id){
            const newProduct = {...i, [field]: newContent};
            return newProduct
          } else {
            return i;
          }
        })
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, '\t'));
        console.log("Producto actualizado")
      } else {
        console.log(`ERROR: No existe un producto con el id: ${id}`);
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    }
  }

  deleteProduct = async (id) => {
    try {
      const content = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(content);
      const productoExiste = products.find(i => i.id === id);
      if(productoExiste){
        const updatedProducts = products.filter(i => i.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, '\t'));
        console.log('Producto eliminado con exito.')
      } else {
        console.log(`ERROR: No existe un producto con el id: ${id}`);
      };
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
    }
  }
}