import express, { Application, Request, Response } from "express"
import cors from "cors"
import { userRoutes } from "./app/modules/user/user.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";

const app: Application = express();

app.use(cors());

// Perser 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Ph Health Care Server...."
    })
})


// all routes 
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);




export default app;