import zod from "zod"

const createAdmin = zod.object({
    password: zod.string({
        required_error: "Password is required"
    }),
    admin: zod.object({
        name: zod.string({
            required_error: 'Name is required'
        }),
        email: zod.string({
            required_error: "Email is required"
        }),
        contactNumber: zod.string({
            required_error: "Contact number is required"
        })
    })
})

export const userValidation = {
    createAdmin,
}