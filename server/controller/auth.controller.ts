import { ZodError } from "zod";
import { AuthSchema } from "../validation/user.schema";
import { prisma } from "../db/db";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const SignUp = async (req: Request, res: Response) => {
  try {
    const parsedData = AuthSchema.parse(req.body);

    const { email, password } = parsedData;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "user already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "signup successful",
      userId: user.id,
    });
  } catch (error) {
    console.error("invalid fields", error instanceof ZodError, error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

export const SignIn = async (req: Request, res: Response) => {
  try {
    const parsedData = AuthSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const isPasswordTrue = await bcrypt.compare(
      password,
      user?.password as string,
    );

    if (!isPasswordTrue) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = await jwt.sign(user?.id!, JWT_SECRET!);

    res.json({
      token,
    });
  } catch (error) {
    console.error("invalid fields", error instanceof ZodError, error);
    return res.status(400).json({ message: "something went wrong" });
  }
};
