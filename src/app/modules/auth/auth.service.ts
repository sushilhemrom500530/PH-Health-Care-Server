import prisma from "../../../shared/prisma"
import * as bcrypt from "bcrypt"
import { jwtHelpers } from './../../../helpers/jwtHelpers';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import apiError from "../../error/apiError";
import status from "http-status";



const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }

    catch (err) {
        throw new Error("You are not authorized!")
    }
    // console.log({ decodedData })
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    })
    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })
    return {
        message: "Password change successfully"
    }
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    const resetPassToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role
        },
        config.jwt.reset_pass_token as Secret,
        config.jwt.refresh_token_expires_in as string
    )

    const resetPassLink = config.reset_pass_link + `?email=${userData.email}&token=${resetPassToken}`
    // console.log(resetPassLink)

    // http:/localhost:3000/reset-password?email=sushil@gmail.com&token=lkjskjsdfkjsdfdsfkhkshf
    await emailSender(
        userData.email,
        `
         <div>
          <p>Dear User,</p>
          <p>Your password reset link</p>
            <a href=${resetPassLink}>
                <button>
                    Reset Password
                </button>
            </a>
            </p>
        </div>
        `
    )
};

const resetPassword = async (token: string, payload: { email: string, password: string }) => {
    // console.log({ token, payload })
    await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    // const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_token as Secret);

    // console.log({ isValidToken })
    // if (!isValidToken) {
    //     throw new apiError(status.FORBIDDEN, "Forbidden access!")
    // }
    const hashedPassword: string = await bcrypt.hash(payload.password, 12);

    const result = await prisma.user.update({
        where: {
            email: payload.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })
    return result;

}
export const authService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,

}