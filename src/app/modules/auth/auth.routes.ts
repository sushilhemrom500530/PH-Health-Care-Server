import express from "express"
import { authController } from "./auth.controller";


const router = express.Router();


router.get("/login", authController.loginUser);



export const authRoute = router;