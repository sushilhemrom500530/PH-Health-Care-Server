import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";
import apiError from './../../error/apiError';
import { status } from 'http-status';



const dashboardMetaData = async (user:TTokenUser) => {
    switch (user.role) {
        case UserRole.SUPER_ADMIN:
            getSuperAdminMetaData();
            break;
            case UserRole.ADMIN:
                getAdminMetaData();
                break;
            case UserRole.DOCTOR:
                getDoctorMetaData();
                break;
            case UserRole.PATIENT:
                getPatientMetaData();
                break;
    
        default:
            throw new Error("Invalid user role!");
            
    }
}

const getSuperAdminMetaData = async (req: Request , res: Response) => {
    console.log("meta data for Super Admin");
};

const getAdminMetaData = async (req: Request , res: Response) => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();
    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: PaymentStatus.PAID
        }
    });

    const barChartData = await getBarChartData();
    const pieCharData = await getPieChartData();

    return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieCharData }
};

const getDoctorMetaData =async (req: Request , res: Response) => {
    console.log("meta data for Doctor");
};

const getPatientMetaData = async (req: Request , res: Response) => {
    console.log("meta data for Patient");
};


export const metaService = {
    dashboardMetaData,
    getSuperAdminMetaData,
    getAdminMetaData,
    getDoctorMetaData,
    getPatientMetaData,
}