import "module-alias/register.js";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Welcome to the API server!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
