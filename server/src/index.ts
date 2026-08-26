import express from "express";
import cors from "cors";

//import routes
import AuthRouter from "../routes/auth.routes";
import TodoRouter from "../routes/todos.routes";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({
    message: "ok",
  });
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/todos", TodoRouter);

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
