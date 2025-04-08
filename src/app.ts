import express, { Application, Request, Response } from "express"
import cors from "cors"
import { userRoutes } from "./app/modules/user/user.routes";

const app: Application = express();

app.use(cors())


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Ph Health Care Server...."
    })
})



app.use("/api/v1/user", userRoutes);




export default app;