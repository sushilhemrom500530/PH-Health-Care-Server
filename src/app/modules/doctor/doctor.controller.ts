import { Request, Response } from "express";
import { doctorService } from "./doctor.service";
import sendResponse from "../../../shared/sentResponse";
import status from "http-status";
import pick from "../../../shared/pick";
import { doctorFilterableFields, doctorFilterOptions } from "./doctor.constant";


const getAllFromDb = async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, doctorFilterOptions);

    const result = await doctorService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Doctor rettrive successfully",
        data: result
    })
};

const updateIntoDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.updateDoctor(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Doctor updated successfully",
        data: result
    })
};

export const doctorController = {
    getAllFromDb,
    updateIntoDB,
}