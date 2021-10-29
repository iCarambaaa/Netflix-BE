import express from 'express';
import listEndpoints from "express-list-endpoints";
//import authorRouter from "./services/authors/index.js";
//import postsRouter from "./services/posts/index.js";
import cors from "cors";
//import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorHandlers.js";

const server = express()

// *********************** GLOBAL MIDDLEWARES ***************************

server.use(cors()) // this! for FE & BE communication
server.use(express.json())   // this! specify before ENDPOINTS, else all will be UNDEFINED


// ************************ ENDPOINTS **********************

// server.use("/authors", authorRouter)
// server.use("/blogPosts", postsRouter)


// *********************** ERROR MIDDLEWARES ***************************

// server.use(badRequestHandler)
// server.use(unauthorizedHandler)
// server.use(notFoundHandler)
// server.use(genericErrorHandler)



const port = process.env.PORT 

console.table(listEndpoints(server)) // usage of express-list-endpoints

server.listen(port, () => {
    console.log('listening on port:', port)
})