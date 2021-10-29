import { body } from "express-validator"
import {getMedia} from '../lib/fs-tools.js'; // fs helper functions


async function checkId(id) {
    const content = await getMedia() // fetch Media array
    const exists = content.find(element => element.imdbID === id)
    if (exists) {
        return true
    } else {
        return false
    }
}


// TODO check uniqueness of IMDB IDs

export const mediaValidationMiddlewares = [
  body("Title").exists().withMessage("Title is a mandatory field!"),
  body("Year").exists().withMessage("Year is a mandatory field!"),
//   body("imdbID").exists().withMessage("imdbID is a mandatory and unique field!").custom((value) => {
//       return Media.checkId(value).then(id =>{
//           if(false) {
//               next()
//           } else throw new Error("ImdbID already present")
//       })
//   }).withMessage("imdbID has to be unique!")
]



export const reviewsValidationMiddlewares = [
  body("comment").exists().withMessage("Comment is a mandatory field!"),
  body("rate").exists().withMessage("Rate is a mandatory field!").matches(/^[1-5]$/).withMessage("Rate must be 1 - 5"), // TODO max rate 5
  body("elementId").exists().withMessage("Element ID is a mandatory field!") // = IMDBID
]