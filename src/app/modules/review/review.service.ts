import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";
import apiError from './../../error/apiError';
import { status } from 'http-status';



const getAllFromDB = async () => {

}


const insertIntoDB = async (user:TTokenUser,payload:any) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where:{
            email:user.email
        }
      })
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where:{
        id:payload.appointmentId
    }
  })
  console.log({patientData,appointmentData});
    if (!(patientData.id === appointmentData.patientId)) {
        throw new apiError(status, "This is not your appointment!")
    }
 return await prisma.$transaction(async (tx) => {
        const result = await tx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        const averageRating = await tx.review.aggregate({
            _avg: {
                rating: true
            }
        });

        await tx.doctor.update({
            where: {
                id: result.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating as number
            }
        })

        return result;
    })
}



export const reviewService = {
    getAllFromDB,
    insertIntoDB,

}