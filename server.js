import express, { urlencoded } from "express";
import "dotenv/config";
const app = express();
import apiUserRoute from "./routes/AuthRouter.js";
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(
  urlencoded({
    extended: false, // support parsing of application/x-www-form-urlencoded
    parameterLimit: "10000", // Limit the number of parameters in a URL query string
  })
);

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Prisma start!");
});
app.use("/api", apiUserRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
