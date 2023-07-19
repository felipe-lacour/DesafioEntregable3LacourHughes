import express from "express";
import handlebars from "express-handlebars";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { handleHTTP } from "./routes/views.routes.js";
import path from 'path'
import { __dirname } from "./utils.js";
import {Server} from "socket.io";

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(
  port,
  () => console.log(`El servidor esta escuchando al puerto ${port}`)
);

// handlebars
app.engine(".hbs", handlebars.engine({extname: ".hbs"}));
app.set("view engine", ".hbs");
app.set( "views", path.join(__dirname, "/views"));

// websocket
const socketServer = new Server(httpServer);



// routes
app.use("/api/products", productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/", handleHTTP(socketServer));