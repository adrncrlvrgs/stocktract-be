const express = require("express");
const userRoutes = require("routes/userRoutes");
const errorMiddleware = require("middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost${PORT}`);
});
