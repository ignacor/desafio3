
//Importo express
import express from "express";

// Importo el archivo de ProductManager de js 
import { ProductManager } from "./ProductManager.js";

// Defino las constantes 
const app = express();
const PORT = 8080;
const productManager = new ProductManager("productos.json");
let productos = [];

//Pagina principal
app.get("/", (req, res) => {
  res.send("Hola a todos!");
});

// Pagina de los productos
app.get("/productos", async (req, res) => {
  const { limit } = req.query;
  try {
    let response = await productManager.getProducts();
    if (limit) {
      let tempArray = response.filter((dat, index) => index < limit);
    
      res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
    } else {
      res.json({ data: response, limit: false, quantity: response.length });
    }
  } catch (err) {
    console.log(err);
  }
});
// Pagina del producto segun su ID
app.get("/productos/:pid", async (req, res) => {
  const { pid } = req.params;

  let product = await productManager.getProductById(parseInt(pid));

  if (product) {
    res.json({ message: "success", data: product });
  } else {
    res.json({
      message: "el producto solicitado no existe",
    });
  }
});

app.listen(PORT, () => {
  console.log("El servidor es funcionando en el puerto: " + PORT);
});