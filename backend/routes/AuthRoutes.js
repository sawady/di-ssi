import express from "express";

const router = express.Router();

router.get("/ping", function (req, res) {
  res.json("pong");
});

export default router;
