import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus } from "@prisma/client";

const getAllFromDB = async (user: TTokenUser, payload: any) => {

}


const insertIntoDB = async (user: TTokenUser, payload: any) => {
    // console.log('appointment created successfully', { payload });
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
   
}


export const prescriptionService = {
    getAllFromDB,
    insertIntoDB,
}