import { Router } from "express";
import {
  createTodo,
  deleteTodoById,
  getAllTodos,
  getTodoById,
  toggleTodo,
  updateTodoById,
} from "../controller/todos.controller";
import { Authmiddleware } from "../middleware/auth.middleware";

const TodoRouter = Router();
TodoRouter.use(Authmiddleware);

TodoRouter.post("/", createTodo);
TodoRouter.get("/", getAllTodos);
TodoRouter.get("/:id", getTodoById);
TodoRouter.put("/:id", updateTodoById);
TodoRouter.patch("/:id/completed", toggleTodo);
TodoRouter.delete("/:id", deleteTodoById);

export default TodoRouter;
