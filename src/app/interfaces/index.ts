import { UserRole } from "@prisma/client"

export type TTokenUser = {
    email: string,
    role: UserRole,
    iat: number,
    exp: number
};

export type TAuthUser = {
    email: string,
    role: string
} | null;