import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import apiError from "../error/apiError";
import status from "http-status";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            // console.log({ token })
            if (!token) {
                throw new apiError(status.UNAUTHORIZED, "You are not authorized!")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)
            req.user = verifiedUser;
            // console.log({ verifiedUser })

            if (roles.length && !roles.includes(verifiedUser?.role)) {
                throw new apiError(status.FORBIDDEN, "Forbidden access!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;