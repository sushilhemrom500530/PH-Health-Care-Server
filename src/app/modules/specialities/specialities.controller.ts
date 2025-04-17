import status from "http-status";
import sendResponse from "../../../shared/sentResponse";
import { specialitiesService } from "./specialities.service";
import { Request, Response } from "express";
import { TFile } from "../../interfaces/file";

const insertIntoDB = async (req: Request, res: Response) => {
    const result = await specialitiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Specialities created successfully",
        data: result
    })
};

export const specialitiesController = {
    insertIntoDB
}