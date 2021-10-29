import express from "express"
import uniqid from 'uniqid'; // randomid generator
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { reviewsValidationMiddlewares } from '../lib/validators.js'; // declared validations
import {getReviews, writeReviews, getMedia} from "../lib/fs-tools.js"


const reviewsRouter = express.Router()

// GET all reviews

reviewsRouter.get("/:id/reviews", async (req, res, next) => {

    try {
      const reviews = await getReviews()
    
      const review = reviews.filter(review => review.elementId === req.params.id)
      
      if (review) {
       
        res.send(review) // send if found
        
      
      } else {
    
        next(createHttpError(404, `No reviews for movie with IMDB ID ${req.params.id}!`)) // return error build with "http-errors" f(404, [msg])
      
      }} catch (error) {
      
      next(error) 
      
    }
  })
  
  // POST a new review
  
  reviewsRouter.post("/:id/reviews", reviewsValidationMiddlewares, async (req, res, next) => {
    
      try {
        const errorList = validationResult(req)
        console.log(errorList)
        if (errorList.isEmpty()) {
      const reviews = await getReviews()
      const movies = await getMedia()
  
      const index = movies.findIndex(movie => movie.imdbID == req.params.id) // checks if movie exists in local data
        if(index) {
  
    reviews.push({
        _id: uniqid(), ...req.body, createdAt: new Date()
    })
  
     await writeReviews(reviews)
  
   res.status(201).send("Posted successfully")
   }else{
    res.status(404).send("Movie not found so you can´t post any reviews for now")
  }} else {
    next(createHttpError(400, { errorList }));
  }
    } catch (error) {
  
      next(error)
    }
  })

// DELETE a review

reviewsRouter.delete("/:id/reviews", async (req, res, next) => {
    try { 
        const reviews = await getReviews()
        const rest = reviews.filter((rev) => rev.elementId !== req.params.id)
        await writeReviews(rest)
        res
        .status(204)
        .send("All reviews for this movie deleted successfully");        
    } catch (error) {
        next (error)
    }

})

export default reviewsRouter;