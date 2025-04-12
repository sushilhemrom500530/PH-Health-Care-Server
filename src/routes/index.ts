import express from "express";
import { userRoutes } from "../app/modules/user/user.routes";
import { adminRoutes } from "../app/modules/admin/admin.routes";

const router = express.Router();

const modulesRoute = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/admin",
        route: adminRoutes
    }
]

modulesRoute.forEach(route => router.use(route.path, route.route))

export default router;