import express from "express";
import AuthRoutes from "./AuthRoutes.js";

const router = express.Router();

router.get("/ping", function (req, res) {
  res.json("pong");
});

router.use("/auth", AuthRoutes);

export default router;
