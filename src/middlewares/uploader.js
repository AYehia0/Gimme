import multer from 'multer'
import fs, { rmSync } from 'fs'
import path from 'path'
import error from '../helpers/error'
const __dirname = path.resolve()

// what the hell is going on here ??
const uploadLocation = `${process.env.UPLOAD_LOC}`
const generalFileSize = process.env.FILE_SIZE

// setting up the storage params
const storageSettings = multer.diskStorage({
    filename : function (req, file, callback) {

        const fileName = file.originalname

        callback(null, fileName)
    },
    destination : function (req, file, callback) {

        const dirType = req.dirType
        // saving at a dir specified by the userID
        const userId = req.user._id
        const location = path.join(__dirname, uploadLocation, `${String(userId)}/${dirType}`)

        // creating the dir if not exists
        fs.mkdirSync(location, { recursive: true })

        // remove all in the profile dir
        if (dirType === process.env.UPLOAD_LOC_PROFILE)
            fs.readdirSync(location).forEach(f => rmSync(`${location}/${f}`))

        callback(null, location)
    }
})

const uploadToDisk = multer({
    storage : storageSettings,
    limits : {
        fileSize : generalFileSize
    },
    fileFilter : (req, file, callback) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            callback(null, true)
        } else {
            callback(null, false)
            return callback(new Error("INV_TYPE"))
        }
    },
    // TODO : specify what type to limit its size
})

export default uploadToDisk