import express from "express"
import multer from "multer"; // image upload handler
import { v2 as cloudinary } from "cloudinary" // CND
import { CloudinaryStorage } from "multer-storage-cloudinary" // multer + CND
import { pipeline } from "stream"
import { getMediaReadableStream, getMedia } from "../lib/fs-tools.js"

// defining CND properties
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS, this line of code is going to search in process.env for CLOUDINARY_URL
    params: {
      folder: "strive-books",
    },
  })

const filesRouter = express.Router()

  // upload movie poster

filesRouter.patch("/:id/poster", multer({ storage: cloudinaryStorage }).single("profilePic"), async (req, res, next) => {
    try {
       
        console.log(req.file)
        const Media = await getMedia()
        const index = Media.findIndex((media) => media.id === req.params.id) 
       
        if (index) {

            Media[index].avatar = req.file.path 
            await writeMedia(Media)
            res.status(201).send(`Image uploaded on Cloudinary: ${req.file.path}` )

        } else {
            res.send(createHttpError(404, `media with ID ${req.params.id} not found`))
        }
    } catch (error) {
      next(error)
    }
  })

export default filesRouter