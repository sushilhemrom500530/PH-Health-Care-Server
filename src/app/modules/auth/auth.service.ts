import prisma from "../../../shared/prisma"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


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

    const accessToken = jwt.sign(
        {
            email: userData.email,
            role: userData.role
        },
        "abcdefghij",
        {
            algorithm: "HS256",
            expiresIn: "7m"
        }
    )
    console.log({ accessToken })

    return userData;
}


export const authService = {
    loginUser,
}