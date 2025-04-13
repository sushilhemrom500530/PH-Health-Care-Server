import { Server } from "http";
import app from "./app"
import config from "./config";


async function main() {
    const server: Server = app.listen(config.port, () => {
        console.log("Server is Running on Port:", config.port)
    })
}

main();