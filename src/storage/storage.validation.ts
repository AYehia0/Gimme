import { diskStorage } from "multer"
import { join } from "path"
import * as fs from "fs"
import { fileTypeFromFile } from "file-type"
import { randomUUID } from "crypto"

// allowed types for profile imgs
type allowedImgExtensionType = "png" | "jpeg" | "jpg" 
type allowedImgMimeType =  "image/png" | "image/jpeg" | "image/jpg"

// TODO: allowed types for chat

export const strorageOpts = {
    storage: diskStorage({
        filename : function (req, file, callback) {
            const fileName = randomUUID() + "-" + file.originalname
            callback(null, fileName)
        },
        destination : function (req, file, callback) {
            /*
            The structure the uploads will follow, doesn't matter if local server or remote one.
                uploads
                └── 62ead5d72a314951d3e7c11d
                    └──  profile 
                        └── profile-img.png
                    └──  media 
                        └──  chat 
                            ├── street-location.png
                            ├── product.jpeg
                            ├── document.txt
                            └── instructions.mp3
                        └──  request 
                            ├── street-location.png
                            └── doc.txt
            */

            // dirty hack to get the userId
            const saveLocation = join(process.env.UPLOAD_LOC, `${req.user["_id"]}`)

            // create the dir if not exists
            fs.mkdirSync(saveLocation, { recursive: true })

            // remove all
            fs.readdirSync(saveLocation).forEach(f => fs.rmSync(`${saveLocation}/${f}`))

            callback(null, saveLocation)
        }
    })
}


// check if the file is valid :
// const isValidFile = async (pathToFile: string, allowedTypes : string [] ): Promise<boolean> => {
//     const fileResult = await fileTypeFromFile(pathToFile)
//
//     if (allowedTypes.includes(fileResult.mime))
//         return true
//
//     return false
// }

// remove the file if not valid
const removeUploadedFile = (pathToFile: string): void => {
    try {
        fs.unlinkSync(pathToFile)
    } catch (error) {
        console.log(error)
    }
}

