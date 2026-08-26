import type { Request, Response } from "express";
import { TodoSchema } from "../validation/todo.schema";
import { ZodError } from "zod";
import { prisma } from "../db/db";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const parsedData = TodoSchema.parse(req.body);

    const { title, description } = parsedData;

    const todo = await prisma.todo.create({
      data: {
        userId: req.userId!,
        title,
        description,
      },
    });

    return res.status(201).json({
      message: "todo created successfully",
      todo: todo.id,
    });
  } catch (error) {
    console.error("invalid input", error instanceof ZodError);
    return res.status(400).json({
      message: "invalid input sent",
    });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const TodoId = req.params.id as string;

    const todo = await prisma.todo.findUnique({
      where: {
        id: TodoId,
        userId: req.userId!,
        isDeleted: false,
      },
    });

    if (!todo) {
      return res.status(404).json({ message: "no todo is found" });
    }

    return res.json({
      todo,
    });
  } catch (error) {
    console.error("invalid input", error instanceof ZodError);
    return res.status(500).json({
      message: "invalid input sent",
    });
  }
};

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.userId!,
        isDeleted: false,
      },
    });

    return res.json({
      todos,
    });
  } catch (error) {
    console.error("invalid input", error instanceof ZodError);
    return res.json({
      message: "invalid input sent",
    });
  }
};
  
export const updateTodoById = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id as string;
    const parsedData = TodoSchema.parse(req.body);

    const { title, description } = parsedData;

    const todo = await prisma.todo.update({
      where: {
        id: todoId,
        userId: req.userId!,
      },
      data: {
        title,
        description,
      },
    });

    return res.json({
      message: "todo updated successfully",
      todo: todo.id,
    });
  } catch (error) {
    console.error("invalid input", error instanceof ZodError);
    return res.status(404).json({
      message: "invalid input sent",
    });
  }
};

export const toggleTodo = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id as string;

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.userId,
        isDeleted: false,
      },
    });

    if (!todo) {
      return res.status(404).json({
        message: "todo not found",
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        completed: !todo.completed,
      },
    });

    return res.json({
      message: "todo toggled successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTodoById = async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id as string;

    const todo = await prisma.todo.update({
      where: {
        id: todoId,
        userId: req.userId,
      },
      data: {
        isDeleted: true,
      },
    });

    return res.json({
      message: "todo deleted successfully",
      todo: todo.id,
    });
  } catch (error) {
    console.error("invalid input", error instanceof ZodError);
    return res.status(404).json({
      message: "invalid input sent",
    });
  }
};
