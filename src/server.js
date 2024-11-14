import express, { json } from "express";
import userRoutes from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(json());
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost${PORT}`);
});
