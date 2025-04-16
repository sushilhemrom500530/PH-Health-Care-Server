import { UserRole } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";


const createAdmin = async (req: any) => {
    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        // console.log("upload to cloudinary", uploadToCloudinary)
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
};

const createDoctor = async (req: any) => {
    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }

    // console.log("data", req.body)

    const data = req.body;
    const hashedPassword: String = await bcrypt.hash(data.password, 12)
    // console.log("hashed password", hashedPassword)
    const userData = {
        email: data.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient: any) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: data.doctor
        })
        return createdDoctorData;
    })

    return result;
}

const createPatient = async (req: any) => {
    const file: TFile = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadToCloudinary?.secure_url
    }

    // console.log("data", req.body)

    const data = req.body;

    const hashedPassword: String = await bcrypt.hash(data.password, 12)
    // console.log("hashed password", hashedPassword)
    const userData = {
        email: data.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient: any) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: data.patient
        })
        return createdPatientData;
    })

    return result;
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient
}