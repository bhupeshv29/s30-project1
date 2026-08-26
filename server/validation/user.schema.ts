import * as z from "zod";

export const AuthSchema = z.object({
  email: z.email("please enter a valid email address"),
  password: z.string().min(8, "please add minimum 8 digit password"),
});
