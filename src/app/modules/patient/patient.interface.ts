import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type TPatientFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
    gender?: string | undefined;
    specialties?: string | undefined;
};

export type TPatientUpdate = {
    patientId?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    width?: string;
    smokingStatus?: boolean;
    dieteryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: MaritalStatus;
};
export type TPatientCreate = {
    patientId?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    width?: string;
    smokingStatus?: boolean;
    dieteryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: MaritalStatus;
};

export type TSpecialties = {
    specialtiesId: string;
    isDeleted?: null;
};