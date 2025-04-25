import prisma from "../../../shared/prisma";
import { TTokenUser } from "../../interfaces"
import { v4 as uuidv4 } from 'uuid';
import { TPaginationOptions } from "../../interfaces/pagination";
import calculatePagination from "../../../helpers/paginationHelper";
import { Prisma, UserRole,AppointmentStatus,PaymentStatus,Prescription } from "@prisma/client";
import apiError from './../../error/apiError';
import { status } from 'http-status';



const dashboardMetaData = async (user:TTokenUser) => {
    console.log("meta data",user);
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
            break;
    }
}

const getSuperAdminMetaData = async (req: Request , res: Response) => {
     
};

const getAdminMetaData = async (req: Request , res: Response) => {
    
};

const getDoctorMetaData =async (req: Request , res: Response) => {
    
};

const getPatientMetaData = async (req: Request , res: Response) => {
   
};


export const metaService = {
    dashboardMetaData,
    getSuperAdminMetaData,
    getAdminMetaData,
    getDoctorMetaData,
    getPatientMetaData,
}