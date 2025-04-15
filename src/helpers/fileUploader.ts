import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import config from "../config";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "uploads"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })






// Configuration
cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret // Click 'View API Keys' above to copy your API secret
});


// Upload an image
const uploadToCloudinary = async (file: any) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file.path, {
            public_id: file.originalname,
        },
            (error, result) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
}



export const fileUploader = {
    upload,
    uploadToCloudinary,
}
