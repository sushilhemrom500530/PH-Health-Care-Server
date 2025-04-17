import { UserRole } from "@prisma/client"

export type TTokenUser = {
    email: string,
    role: UserRole,
    iat: number,
    exp: number
} 