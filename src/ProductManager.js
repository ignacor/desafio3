// Importo Utils y crypto
import utils from "./utils.js";
import crypto from "crypto";
//La clase constructora
export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }
  // Funcion para agregar productos
  async addProduct(title, description, price, thumbnail, code, stock) {

    if (
      title == undefined ||
      description == undefined ||
      price == undefined ||
      thumbnail == undefined ||
      code == undefined ||
      stock == undefined
    ) {
      throw new Error("Todos los campos son obligatorios");
    }
    try {
      let data = await utils.readFile(this.path);
      console.log(data);
      this.products = data?.length > 0 ? data : [];
    } catch (error) {
      console.log(error);
    }

    let codeExists = this.products.some((dato) => dato.code == code);

    if (codeExists) {
      throw new Error("El codigo ya existe por favor verifique");
    } else {
      const newProduct = {
        id: crypto.randomUUID(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(newProduct);
      console.log(this.products.length);
      try {
        await utils.writeFile(this.path, this.products);
      } catch (error) {
        console.log(error);
      }
    }

    
  }
  // Funcion para que me devuelva los productos
  async getProducts() {
    try {
      let data = await utils.readFile(this.path);
      this.products = data;
      return data?.length > 0 ? this.products : "aun no hay registros";
    } catch (error) {
      console.log(error);
    }
  }
  // Funcion para que me devuelva los productos segun su ID
  async getProductById(id) {
    try {
      let data = await utils.readFile(this.path);
      this.products = data?.length > 0 ? data : [];
      let product = this.products.find((dato) => dato.id === id);

      if (product !== undefined) {
        return product;
      } else {
        return "no existe el producto solicitado";
      }
    } catch (error) {
      console.log(error);
    }
  }
// Funcion para actualizar los productos segun su id
  async updateProductById(id, data) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];

      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          ...data,
        };
        await utils.writeFile(this.path, products);
        return {
          mensaje: "producto actualizado",
          producto: this.products[productIndex],
        };
      } else {
        return { mensaje: "no existe el producto solicitado" };
      }
    } catch (error) {
      console.log(error);
    }
  }
// Funcion para borrar productos
  async deleteProductById(id) {
    try {
      let products = await utils.readFile(this.path);
      this.products = products?.length > 0 ? products : [];
      let productIndex = this.products.findIndex((dato) => dato.id === id);
      if (productIndex !== -1) {
        let product = this.products[productIndex];
        this.products.splice(productIndex, 1);
        await utils.writeFile(this.path, products);
        return { mensaje: "producto eliminado", producto: product };
      } else {
        return { mensaje: "no existe el producto solicitado" };
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default {
  ProductManager,
}; 

