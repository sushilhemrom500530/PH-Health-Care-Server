import { Request } from "express";
import { TFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const getAllFromDb = async () => {
    const result = await prisma.specialities.findMany();
    return result;
};

const insertIntoDB = async (req: Request) => {
    const file = req.file as TFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url
    }

    const result = await prisma.specialities.create({
        data: req.body
    })
    return result;
};

const getSingleData = async (id: string) => {

    const result = await prisma.specialities.findUnique({
        where: {
            id
        }
    });
    return result;
};

const deleteSpecialities = async (id: string) => {

    const result = await prisma.specialities.delete({
        where: {
            id
        }
    })
    return result;
};

export const specialitiesService = {
    insertIntoDB,
    getSingleData,
    deleteSpecialities,
    getAllFromDb
}