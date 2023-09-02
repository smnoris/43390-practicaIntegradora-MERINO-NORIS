import { Router } from "express";
import VideoGamesManager from "../dao/managers/VideogamesManager.js";
import uploader from "../services/uploadService.js";

const router = Router();
const videogamesService = new VideoGamesManager();

router.get("/", async (req, res) => {
  const videogames = await videogamesService.getVideogames();
  res.send({ status: "success", payload: videogames });
});

router.post("/", uploader.array("images"), async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  const { title, description, price, categories } = req.body;
  
  if (!title || !description || !price)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  
  const newVideogame = {
    title,
    description,
    price,
    categories,
  };
  const images = req.files.map(
    (file) =>
      `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/img/${
        file.filename
      }`
  );
  newVideogame.images = images;
  
  const result = await videogamesService.createVideogame(newVideogame);
  res.send({ status: "success", payload: result._id });
});

router.put("/:vid", async (req, res) => {
  const { vid } = req.params;
  const { title, description, price, categories } = req.body;
  
  const updateVideogame = {
    title,
    description,
    price,
    categories,
  };

  const videogame = await videogamesService.getVideogameBy({ _id: vid });
  if (!videogame)
    return res
      .status(400)
      .send({ status: "error", error: "Videogame doesn't exist" });
  await videogamesService.updateVideogame(vid, updateVideogame);
  res.send({ status: "success", message: "Videogame updated" });
});

router.delete("/:vid", async (req, res) => {
  const { vid } = req.params;
  const result = await videogamesService.deleteVideogame(vid);
  res.send({ status: "success", message: "Videogame Deleted" });
});

export default router;