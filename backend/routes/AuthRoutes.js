import express from "express";
import Credential from "../model/credential.js";
import { encrypt, compare } from "../helpers/encrypt.js";

const router = express.Router();

router.post("/credential/get", async function (req, res) {
  const { email, password } = req.body;
  const credential = await Credential.findOne({ email });
  if (!credential) {
    res
      .status(404)
      .json({ error: `an user with email ${email} does not exist` });
    return;
  }
  if (await compare(password, credential.password)) {
    res.json(credential);
    return;
  }
  res.status(403).json({
    error: "password does not match",
  });
});

router.post("/credential/save", async function (req, res) {
  const { email, did, date, password, privateKey } = req.body;
  if (await Credential.findOne({ email })) {
    res
      .status(400)
      .json({ error: `an user with email ${email} already exist` });
    return;
  }
  try {
    const credential = new Credential({
      email,
      did,
      date: new Date(date),
      password: await encrypt(password),
      privateKey,
    });
    const saved = await credential.save();
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
