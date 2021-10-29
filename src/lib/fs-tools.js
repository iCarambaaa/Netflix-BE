import fs from "fs-extra"
import { dirname, join } from "path"

const {readJSON, writeJSON, writeFile, createReadStream } = fs //readJSON and writeJSON are not part of the "normal" fs module -- async functions


// ****************** declare all file paths ******************
export const publicDirectory = join(process.cwd(), "./public") // getting the folder path - process.cwd() gives the root folder

const dataFolder = join(process.cwd(), "/src/data") // process.cwd() gives the root folder

const mediaJSONPath = join(dataFolder, "media.json") // Joining folder path and file
const reviewsJSONPath = join(dataFolder, "reviews.json")


// ****************** USE HELPERFUNCTIONS TO GET AND WRITE THE JSON *******************

export const getMedia = () => readJSON(mediaJSONPath) //don`t forget to export
export const getReviews = () => readJSON(reviewsJSONPath)

export const writeMedia = (content) => writeJSON(mediaJSONPath, content) // don't forget the content
export const writeReviews = (content) => writeJSON(reviewsJSONPath, content)


// ****************** HELPERFUNCTION TO CREATE READBLE STREAM *******************

export const getMediaReadableStream = () => createReadStream(mediaJSONPath)

export const getReviewsReadableStream = () => createReadStream(reviewsJSONPath) //not used so far