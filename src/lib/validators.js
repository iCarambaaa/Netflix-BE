import { body } from "express-validator"
import {getMedia} from '../lib/fs-tools.js'; // fs helper functions


export const mediaValidationMiddlewares = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("Year is a mandatory field!"),
  body("imdbID").exists().withMessage("ImdbID is a mandatory field!")
]


export const reviewsValidationMiddlewares = [
  body("comment").exists().withMessage("Comment is a mandatory field!"),
  body("rate").exists().withMessage("Rate is a mandatory field!").matches(/^[1-5]$/).withMessage("Rate must be 1 - 5"),
  body("elementId").exists().withMessage("Element ID is a mandatory field!") // = IMDBID
]


export async function myCustomMiddlewareForCheckingUniqueness(req, res, next) {
    const content = await getMedia()
    
    const exists = content.find(element => element.imdbID === req.body.imdbID)
    
    if (exists) {
        res.status(400).send( "ID already exists")
        
    } else {
        next()
    }
}