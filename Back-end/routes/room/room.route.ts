import express from "express";
import config from "../../config";
import RoomModel from "../../models/Room.model";
import UserModel from "../../models/User.model";

const router = express.Router();
const primaryKey = config.PRIMARYKEY;

router.get("/", (req, res) => {
  res.send("<h1>ROUTE USER</h1>");
});

router.post("/create", (req, res) => {
  // req.body has
  // username,password
  try {
    RoomModel.create(req.body, (err) => {
      if (err) {
        res.sendStatus(503);
      } else res.sendStatus(201);
    });
  } catch (error) {}
});

router.get("/:id", (req, res) => {
  UserModel.findById(req.params.id, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(data);
    }
  });
});

export default router;
