import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";
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
                getDoctorMetaData(user as TTokenUser);
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
    console.log(appointmentCount,patientCount, doctorCount, paymentCount,totalRevenue);

    // const barChartData = await getBarChartData();
    // const pieCharData = await getPieChartData();

    // return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieCharData }
};

const getDoctorMetaData =async (user:TTokenUser) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });
};

const getPatientMetaData = async () => {
    console.log("meta data for Patient");
};


export const metaService = {
    dashboardMetaData,
    getSuperAdminMetaData,
    getAdminMetaData,
    getDoctorMetaData,
    getPatientMetaData,
}