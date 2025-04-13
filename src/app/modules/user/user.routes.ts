import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const router = express.Router();

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            // console.log({ token })
            if (!token) {
                throw new Error("You are not authorized!")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret)
            // jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)

            // req.user = verifiedUser;
            // console.log({ verifiedUser })

            if (roles.length && !roles.includes(verifiedUser?.role)) {
                throw new Error("Forbidden!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
}

router.post("/", auth('ADMIN', 'DOCTOR'), userController.createAdmin)


export const userRoutes = router;