import express from "express";
import cors from "cors";

//import routes
import AuthRouter from "../routes/auth.routes";
import TodoRouter from "../routes/todos.routes";

const app = express();
const PORT = Number(process.env.PORT || 8000);

app.use(express.json());

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL is not defined");
}

app.use(
  cors({
    origin: [frontendUrl, "http://localhost:3000"],
  }),
);

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
