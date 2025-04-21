import express from "express";
import { userRoutes } from "../app/modules/user/user.routes";
import { adminRoutes } from "../app/modules/admin/admin.routes";
import { authRoutes } from "../app/modules/auth/auth.routes";
import { specialitiesRoutes } from "../app/modules/specialities/specialities.routes";
import { doctorRoutes } from "../app/modules/doctor/doctor.routes";
import { patientRoutes } from "../app/modules/patient/patient.routes";
import { scheduleRoute } from "../app/modules/schedule/schedule.routes";
import { doctorScheduleRoute } from "../app/modules/doctor-schedule/doctor-schedule.routes";

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
        route: specialitiesRoutes
    },
    {
        path: "/doctor",
        route: doctorRoutes
    },
    {
        path: "/patient",
        route: patientRoutes
    },
    {
        path: "/schedule",
        route: scheduleRoute
    },
    {
        path: "/doctor-schedule",
        route: doctorScheduleRoute
    },
]


modulesRoute.forEach(route => router.use(route.path, route.route))

export default router;