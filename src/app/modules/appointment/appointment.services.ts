import { TTokenUser } from "../../interfaces"


const getAllFromDB = async (user: TTokenUser, payload: any) => {
    console.log('appointment created successfully')
}
const insertIntoDB = async (user: TTokenUser, payload: any) => {
    console.log('appointment created successfully')
}

export const appointmentService = {
    getAllFromDB,
    insertIntoDB
}