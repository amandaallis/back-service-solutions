import express, { request, response } from 'express';
import requesterRouter from './src/domains/requester/routes.js';
import cors from "cors"

const port = 3000;
const server = express();
server.use(cors())
server.use(express.json());
server.use(requesterRouter);

server.listen(port, () => {
    console.log("Server is running on port ", port);
});
