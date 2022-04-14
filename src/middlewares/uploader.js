import multer from 'multer'
import fs from 'fs'
import path from 'path'

const uploadLocation = `../../${process.env.UPLOAD_LOC}`
const generalFileSize = process.env.FILE_SIZE

// setting up the storage params
const storageSettings = multer.diskStorage({
    filename : function (req, file, callback) {

        // the filename as template
        const fileName = `${Date.now()}${path.extname(file.originalname)}`

        callback(null, fileName)
    },
    destination : function (req, file, callback) {

        // saving at a dir specified by the userID
        const userId = req.user._id
        const location = path.join(__dirname, uploadLocation, String(userId))

        // creating the dir if not exists
        fs.mkdirSync(location, { recursive: true })

        callback(null, location)
    }
})

const uploadToDisk = multer({
    storage : storageSettings,
    limits : {
        fileSize : generalFileSize
    }
    // TODO : specify what type to limit its size
})

export default uploadToDisk