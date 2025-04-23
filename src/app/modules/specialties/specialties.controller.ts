import status from "http-status";
import sendResponse from "../../../shared/sentResponse";
import { specialtiesService } from "./specialties.service";
import { Request, Response } from "express";
import { TFile } from "../../interfaces/file";

const getAllFromDb = async (req: Request, res: Response) => {
    const result = await specialtiesService.getAllFromDb();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialties fetched successfully",
        data: result
    })
};
const insertIntoDB = async (req: Request, res: Response) => {
    const result = await specialtiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialties created successfully",
        data: result
    })
};

const getSingleData = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log({ id })
    const result = await specialtiesService.getSingleData(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialties retrieve successfully",
        data: result
    })
};

const deleteSpecialties = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log({ id })
    const result = await specialtiesService.deleteSpecialties(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialties deleted successfully",
        data: result
    })
};

export const specialtiesController = {
    insertIntoDB,
    getSingleData,
    deleteSpecialties,
    getAllFromDb
}