import { Router } from "express";
import { SignUp, SignIn } from "../controller/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/signup", SignUp);
AuthRouter.post("/signin", SignIn);

export default AuthRouter;
