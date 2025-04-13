import prisma from "../../../shared/prisma"
import * as bcrypt from "bcrypt"
import { jwtHelpers } from './../../../helpers/jwtHelpers';
import jwt, { JwtPayload } from "jsonwebtoken";



const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    })
    // console.log("Logged in user....", userData)
    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);
    console.log("is correct password", isCorrectPassword)
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const accessToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role
        },
        "abcdefghij",
        "5m"
    )

    const refreshToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role
        },
        "abcdefghijjhjh",
        "30d"
    )

    console.log({ accessToken })

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange,
        refreshToken
    };
}

const refreshToken = async (token: string) => {
    // console.log("refresh token:", token)
    let decodedData;
    try {
        decodedData = jwt.verify(token, "abcdefghijjhjh") as JwtPayload
    } catch (error) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData?.email
        }
    })

    const accessToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role
        },
        "abcdefghij",
        "5m"
    )

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };
}


export const authService = {
    loginUser,
    refreshToken
}