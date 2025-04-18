import prisma from "../../../shared/prisma"


const getAllFromDB = async () => {
    const result = await prisma.doctor.findMany();
    return result;
}
const updateDoctor = async (id: string, payload: any) => {
    const { specialities, ...doctorData } = payload;

    console.log(id)

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const result = await prisma.$transaction(async (transectionClient) => {
        const updateDoctor = await transectionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });

        if (specialities && specialities.length > 0) {
            const deleteSpecialitiesIds = specialities.filter((speciality: any) => speciality.isDeleted);

            for (const speciality of deleteSpecialitiesIds) {
                await transectionClient.doctorSpecialities.create({
                    data: {
                        specialitiesId: speciality.specialitiesId,
                        doctorId: doctorInfo.id
                    }
                })
            }
        }

        for (const specialitiesId of specialities) {
            await transectionClient.doctorSpecialities.create({
                data: {
                    specialitiesId: specialitiesId,
                    doctorId: doctorInfo.id
                }
            })
        }
        return updateDoctor
    })


    return result;
}

export const doctorService = {
    getAllFromDB,
    updateDoctor,
}