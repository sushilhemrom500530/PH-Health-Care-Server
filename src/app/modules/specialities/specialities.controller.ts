import status from "http-status";
import sendResponse from "../../../shared/sentResponse";
import { specialitiesService } from "./specialities.service";
import { Request, Response } from "express";
import { TFile } from "../../interfaces/file";

const getAllFromDb = async (req: Request, res: Response) => {
    const result = await specialitiesService.getAllFromDb();

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialities fetched successfully",
        data: result
    })
};
const insertIntoDB = async (req: Request, res: Response) => {
    const result = await specialitiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialities created successfully",
        data: result
    })
};

const getSingleData = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log({ id })
    const result = await specialitiesService.getSingleData(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialities rettrive successfully",
        data: result
    })
};

const deleteSpecialities = async (req: Request, res: Response) => {
    const { id } = req.params;
    // console.log({ id })
    const result = await specialitiesService.deleteSpecialities(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialities deleted successfully",
        data: result
    })
};

export const specialitiesController = {
    insertIntoDB,
    getSingleData,
    deleteSpecialities,
    getAllFromDb
}