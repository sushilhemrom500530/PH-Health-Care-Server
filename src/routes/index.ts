import express from "express";
import { userRoutes } from "../app/modules/user/user.routes";
import { adminRoutes } from "../app/modules/admin/admin.routes";
import { authRoutes } from "../app/modules/auth/auth.routes";
import { specialities } from "../app/modules/specialities/specialities.route";

const router = express.Router();

const modulesRoute = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/admin",
        route: adminRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/specialities",
        route: specialities
    },
]

modulesRoute.forEach(route => router.use(route.path, route.route))

export default router;