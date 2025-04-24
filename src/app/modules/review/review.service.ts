import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";



const getAllFromDB = async () => {

}


const insertIntoDB = async (user:TTokenUser,payload:any) => {

  const patientData = await prisma.patient.findUniqueOrThrow({
    where:{
        email:user.email
    }
  })
  console.log({patientData});
}



export const reviewService = {
    getAllFromDB,
    insertIntoDB,

}