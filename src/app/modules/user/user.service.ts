import { UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"
import { fileUploader } from "../../../helpers/fileUploader";


const createAdmin = async (req: any) => {
    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        console.log("upload to cloudinary", uploadToCloudinary)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url

    }
    // console.log(req.file, req.body.data)
    const data = req.body;
    const hashedPassword: String = await bcrypt.hash(data.password, 12)
    // console.log("hashed password", hashedPassword)
    const userData = {
        email: data.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient: any) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: data.admin
        })
        return createdAdminData;
    })

    return result;
}

export const userService = {
    createAdmin
}