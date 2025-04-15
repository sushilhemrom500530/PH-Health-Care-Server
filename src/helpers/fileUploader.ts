import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';


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
    cloud_name: 'dz0hdhcn0',
    api_key: '312399472434817',
    api_secret: '1nlW4UFPrammxcS4CLtuMXCBsQQ' // Click 'View API Keys' above to copy your API secret
});


// Upload an image
const uploadToCloudinary = async (file: any) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file.path, {
            public_id: file.originalname,
        },
            (error, result) => {
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
