import express from 'express';
import createHttpError from "http-errors" // easier error creation
import {getMedia, writeMedia} from '../lib/fs-tools.js'; // fs helper functions
import { mediaValidationMiddlewares, myCustomMiddlewareForCheckingUniqueness } from '../lib/validators.js'; // declared validations
import { validationResult } from "express-validator" // validation helper need inside post/put to work with validation middleware


const mediaRouter = express.Router() // declare Router
// a Router is a set of endpoints that share something like a prefix (MediaRouter is going to share /Media as a prefix)


// ******************** routes for API requests ****************

//GET all Media

mediaRouter.get("/", async(req, res, next) => { // remember to declare as async
    try {
        const content = await getMedia()
        console.log("✅ GET Media fired: ", content)
        
        if (req.query && req.query.title) { // in case we have a query to deal with
            const filteredMedia = content.filter(element => element.name === req.query.name)
            res.send(filteredMedia)
            
        } else {
            res.send(content)
        }
        
    } catch (error) {    // Errors that happen here need to be 500 errors (Generic Server Error)
        next(error)     // forward error to error handlers (next is a function and takes the error as parameter)
    }

})

// GET single media

mediaRouter.get("/:id", async(req, res, next) => {
    try {
        const content = await getMedia() // fetch Media array
        const media = content.find(element => element.imdbID === req.params.id) // find media by id provided in the URL
        if (media) {
                res.send(media) // send media if found
                console.log("✅ GET Single media fired: ", content)
        } else {

            next(createHttpError(404, `Movie with IMDB ID ${req.params.id} not found!`)) // create and forward error // this http-errors syntax
            console.log(`❌ GET Single media fired with id ${req.params.id}:`, 404)
         }

    } catch (error) {
        next(error)
    }
}) 

// POST media 

mediaRouter.post("/", myCustomMiddlewareForCheckingUniqueness, mediaValidationMiddlewares, async(req, res, next) => {
    try {
        const errorList = validationResult(req)
         if (errorList.isEmpty()) {
             const media = await getMedia()                 // get array of Media

                const newMedia = {...req.body}                // create new media
                media.push(newMedia)                         // add media
                await writeMedia(media)                     // update JSON
                res.status(201).send(newMedia)             // send back updated media

         }else{
             
            next(createHttpError(400, { errorList }));
         }
    } catch (error) {
        next (error)
    }

})

// PUT media // TODO: validation // TODO: validation

mediaRouter.put("/:id", async(req, res, next) => {
    try {
            const media = await getMedia()
            const index = media.findIndex((media) => media.imdbID === req.params.id) 
            const luckyMedia = {...media[index], ...req.body}
            media[index] = luckyMedia

            await writeMedia(media)
            
            res.status(200).send(luckyMedia)

    } catch (error) {

        next(error)
    }
})


// DELETE media

mediaRouter.delete("/:id", async(req, res,next) => {
    try { 
        const media = await getMedia()
        const rest = media.filter((media) => media.imdbID !== req.params.id)
        await writeMedia(rest)
        res
        .status(204)
        .send(`Movie with IMDB ID ${req.params.id} deleted successfully`);        
    } catch (error) {
        next (error)
    }
})

// export the router 

export default mediaRouter 