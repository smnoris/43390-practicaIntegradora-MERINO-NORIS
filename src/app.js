import express from "express";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import Handlebars from "express-handlebars";
import videogameRouter from "./routes/videogames.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const connection = mongoose.connect(
  "mongodb+srv://Ayelenleclerc:yuskia13@backend.xrrgkdz.mongodb.net/coderGaming?retryWrites=true&w=majority"
);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", Handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/videogames", videogameRouter);