import { Admin, Doctor, UserRole, Patient, Prisma, UserStatus } from "@prisma/client"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"
import { fileUploader } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { Request } from "express";
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";


const createAdmin = async (req: Request): Promise<Admin> => {
    const file = req.file as TFile;

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

const createDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file as TFile;

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
};

const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as TFile;

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
};

const getAllFromDB = async (params: any, options: TPaginationOptions) => {
    const { searchTerm, ...filterData } = params;
    const { page, limit, skip, } = calculatePagination(options);
    const andConditions: Prisma.UserWhereInput[] = [];
    console.log({ params })

    if (params.searchTerm) {
        andConditions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // specific field name for filter or query in DB 
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    // console.dir(andConditions, { depth: "inifinity" })

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            doctor: true,
            patient: true,
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
};

const changeProfileStatus = async (id: string, data: { status: UserStatus }) => {
    console.log(id, data)
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })
    const userUpdateStatus = await prisma.user.update({
        where: {
            id
        },
        data: {
            status: data.status
        }
    })
    return userUpdateStatus;
};

export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus
}