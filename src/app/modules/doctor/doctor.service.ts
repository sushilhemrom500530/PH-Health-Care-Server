import prisma from "../../../shared/prisma"


const getAllFromDB = async () => {
    const result = await prisma.doctor.findMany();
    return result;
}
const updateDoctor = async (id: string) => {
    console.log(id)
}

export const doctorService = {
    getAllFromDB,
    updateDoctor,
}