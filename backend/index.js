import mongoose from "mongoose";
import express from "express";
import http from "http";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import Routes from "./routes/Routes.js";

dotenv.config();

const app = express();
var server = http.createServer(app);

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (_, res) => res.send(`di-ssi v${process.env.VERSION}`));

app.use(Routes);

app.use("*", function (_, res) {
  return res.status(404).json({
    errorCode: "INVALID_ROUTE",
    message: "Route does not exist",
  });
});

(async function () {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT);
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    console.log(err.message);
  }
})();
