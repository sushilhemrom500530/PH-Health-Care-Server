import express, { Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import router from "./routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import status from "http-status";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());

// Perser 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Ph Health Care Server...."
    })
})


// all routes 
app.use("/api/v1", router);

app.use(globalErrorHandler)


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})


export default app;