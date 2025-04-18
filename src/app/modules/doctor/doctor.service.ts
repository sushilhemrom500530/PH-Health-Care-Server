import prisma from "../../../shared/prisma"


const getAllFromDB = async () => {
    const result = await prisma.doctor.findMany();
    return result;
}
const updateDoctor = async (id: string, payload: any) => {
    const { specialities, ...doctorData } = payload;

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    await prisma.$transaction(async (transectionClient) => {
        await transectionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialities && specialities.length > 0) {
            // delete specialities 
            const deleteSpecialitiesIds = specialities.filter((speciality: any) => speciality.isDeleted);

            for (const speciality of deleteSpecialitiesIds) {
                await transectionClient.doctorSpecialities.deleteMany({
                    where: {
                        specialitiesId: speciality.specialitiesId,
                        doctorId: doctorInfo.id
                    }
                })
            }
            // create specialities 
            const createSpecialitiesIds = specialities.filter((speciality: any) => !speciality.isDeleted);

            for (const speciality of createSpecialitiesIds) {
                await transectionClient.doctorSpecialities.create({
                    data: {
                        specialitiesId: speciality.specialitiesId,
                        doctorId: doctorInfo.id
                    }
                })
            }
        }
    })

    const result = await prisma.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialities: {
                include: {
                    specialities: true
                }
            }
        }
    })

    return result;
}

export const doctorService = {
    getAllFromDB,
    updateDoctor,
}